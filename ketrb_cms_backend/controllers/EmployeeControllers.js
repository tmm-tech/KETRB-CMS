const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add a new employee
  AddEmployee: async (req, res) => {
    const { first_name, last_name, job_title, department, role_type, email, phone, hire_date, status, author, user_id, created_at } = req.body;
    const profileImage = req.file;
console.log('Profile Image URL:', profileImage);
    try {
      let imagePath = null;
      if (profileImage) {
        const cloudinaryResult = await cloudinary.uploader.upload(profileImage.path, { folder: 'employees' });
        imagePath = cloudinaryResult.secure_url;
      }

      const result = await query(
        'INSERT INTO employee (first_name, last_name, job_title, department, role_type, email, phone, hire_date, profile_image, author, status,created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [first_name, last_name, job_title, department, role_type, email, phone, hire_date, imagePath, author, status, created_at]
      );
      // Notify admins for approval if status is pending
      if (status === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'employee_uploaded',
            first_name,
            `Employee "${first_name}" uploaded by ${author} pending approval.`,
            user_id,  // The editor's ID
            'administrator',  // Notify all admins
            false     // Not read yet
          ]
        );
      }
      res.status(201).json({ message: 'Employee added successfully', employee: result.rows[0] });
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ message: 'Server error while adding the employee.' });
    }
  },

  // Get all employees (excluding deleted ones)
  GetAllEmployees: async (req, res) => {
    try {
      const result = await query('SELECT * FROM employee WHERE isdeleted = false ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Error fetching employees.' });
    }
  },

  // Get a single employee by ID
  GetEmployeeById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query('SELECT * FROM employee WHERE id = $1 AND isdeleted = false', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ message: 'Error fetching the employee.' });
    }
  },

  // Update employee details
  UpdateEmployee: async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, job_title, department, role_type, email, phone, hire_date, status, author, role, user_id, created_at } = req.body;
    const profileImage = req.file;

    try {
      const existingEmployee = await query('SELECT * FROM employee WHERE id = $1', [id]);
      if (existingEmployee.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }

      // Determine the new status based on role
      let employeestatus = status;
      if (role === 'editor') {
        employeestatus = 'pending';
      } else if (role === 'administrator' && status === 'pending') {
        employeestatus = 'published';
      }

      let imagePath = existingEmployee.rows[0].profile_image;
      if (profileImage) {
        const cloudinaryResult = await cloudinary.uploader.upload(profileImage.path, { folder: 'employees' });
        imagePath = cloudinaryResult.secure_url;
      }

      const result = await query(
        'UPDATE employee SET first_name = $1, last_name = $2, job_title = $3, department = $4, role_type = $5, email = $6, phone = $7, hire_date = $8, profile_image = $9, author = $10, status = $11, created_at = $12 WHERE id = $13 RETURNING *',
        [first_name, last_name, job_title, department, role_type, email, phone, hire_date, imagePath, author, status, created_at, id]
      );
      if (employeestatus === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'employee_updated',
            title,
            `Employee "${first_name}" has been updated and is pending approval.`,
            user_id,
            'administrator',
            false
          ]
        );
      }
      res.status(200).json({ message: 'Employee updated successfully', employee: result.rows[0] });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Error updating the employee.' });
    }
  },


  // Approve a news article (set its status to 'published')
  ApproveEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const employeeResult = await query('SELECT title FROM news WHERE id = $1', [id]);

      // Check if the image exists
      if (employeeResult.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }

      const filename = newsResult.rows[0].title;
      const existingNotification = await query(
        'SELECT sender_id FROM notifications WHERE (notification_type = $1 OR notification_type = $2) AND item_id = $3',
        ['employee_uploaded', 'employee_updated', filename]
      );

      if (existingNotification.rows.length > 0) {
        // If an existing notification is found, use its sender_id
        const senderIdToUse = existingNotification.rows[0].sender_id;
        const result = await query(
          'UPDATE employee SET status = $1 WHERE id = $2 RETURNING *',
          ['published', id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Employee not found.' });
        }
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'employee_approved',
            id,
            `Employee has been approved for publishing.`,
            senderIdToUse,
            'editor',
            false
          ]
        );

        res.status(200).json({ message: 'Employee approved successfully', news: result.rows[0] });
      }
    } catch (error) {
      console.error('Error approving employee:', error);
      res.status(500).json({ message: 'Error approving the Employee Creation.' });
    }
  },

  // Cancel a news article
  CancelEmployee: async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    try {
      // Check if there's a deletion request notification for the image
      const notificationResult = await query(
        'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
        ['employee_marked_for_deletion', id]
      );

      // If a notification for the deletion request exists, get the user_id
      let userId = null;
      if (notificationResult.rows.length > 0) {
        userId = notificationResult.rows[0].sender_id;
      }
      const result = await query(
        'UPDATE employee SET isdeleted = FALSE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const updatedNews = result.rows[0];
      await query(
        'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'employee_marked_for_deletion',
          id,
          `Employee deletion by ${userId}.Has been Canceled`,
          userId,
          'editor',
          false
        ]
      );
      res.status(200).json(updatedNews);
    } catch (error) {
      console.error('Error canceling Employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  // Soft delete an employee
  DeleteEmployee: async (req, res) => {
    const { id } = req.params;
    const { role, user_id } = req.body;
    try {

      if (role === 'editor') {
        const result = await query('UPDATE employee SET isdeleted = TRUE WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Employee not found.' });
        }

        // Notify the administrator about the deletion request
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'employee_marked_for_deletion',
            id,
            `Employee has been marked for deletion by editor with ID ${user_id}.`,
            user_id, // Editor who made the request
            'administrator', // Notify administrators
            false // Mark as unread
          ]
        );
        res.status(200).json({ message: 'Employee marked as deleted.', employee: result.rows[0] });
      } else if (role === 'administrator') {

        // Check if a deletion request notification was already sent
        const notificationResult = await query(
          'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
          ['employee_marked_for_deletion', id]
        );

        let existingUserId = null;

        if (notificationResult.rows.length > 0) {
          // If a notification exists, get the original requestor's user ID
          existingUserId = notificationResult.rows[0].sender_id;

        }

        // Proceed with the deletion
        const result = await query('DELETE FROM employee WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Employee not found.' });
        }

        // Notify the editor if deletion was previously requested
        if (existingUserId) {
          await query(
            'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
            [
              'employee_deletion_approved',
              id,
              `Employee deletion has been approved by administrator with ID ${user_id}.`,
              existingUserId, // Notify the editor who made the request
              'editor', // Notify editor
              false // Mark as unread
            ]
          );
        }

        return res.status(200).json({
          message: 'Employee deleted successfully.',
          news: result.rows[0],
        });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Error deleting the employee.' });
    }
  },
};

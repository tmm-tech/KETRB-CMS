const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add a new job posting
  AddCareer: async (req, res) => {
    console.log('Received Data:', req.body); // Log incoming data
    const { title, description, department, employment_type, location, salary_range, requirements, responsibilities, benefits, status, application_deadline, created_by, user_id, posted_date } = req.body;

    try {
      const result = await query(
        `INSERT INTO careers (title, description, department, job_type, location, salary_range, closing_date,status,requirements,responsibilities,benefits,created_by,posted_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [title, description, department, employment_type, location, salary_range, application_deadline, status, requirements, responsibilities, benefits, created_by, posted_date]
      );

      console.log('Insert Result:', result.rows[0]); // Log the inserted row
      // Notify admins for approval if status is pending
      if (status === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'careerpost_uploaded',
            title,
            `Career Post "${title}" uploaded by ${author} pending approval.`,
            user_id,  // The editor's ID
            'administrator',  // Notify all admins
            false     // Not read yet
          ]
        );
      }
      res.status(201).json({ message: 'Job posting added successfully', career: result.rows[0] });
    } catch (error) {
      console.error('Error adding job posting:', error);
      res.status(500).json({ message: 'Server error while adding job posting.' });
    }
  },
  // Get all job postings (excluding deleted ones)
  GetAllCareers: async (req, res) => {
    try {
      const result = await query('SELECT * FROM careers ORDER BY posted_date DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      res.status(500).json({ message: 'Error fetching job postings.' });
    }
  },

  // Get all job postings (excluding deleted ones)
  GetPublishedCareers: async (req, res) => {
    try {
      const result = await query('SELECT * FROM careers WHERE isdeleted = false AND status = $1 ORDER BY posted_date DESC', ['published']);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      res.status(500).json({ message: 'Error fetching job postings.' });
    }
  },

  // Cancel a news article
  CancelCareer: async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    try {
      // Check if there's a deletion request notification for the image
      const notificationResult = await query(
        'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
        ['careerpost_marked_for_deletion', id]
      );

      // If a notification for the deletion request exists, get the user_id
      let userId = null;
      if (notificationResult.rows.length > 0) {
        userId = notificationResult.rows[0].sender_id;
      }
      const result = await query(
        'UPDATE careers SET isdeleted = FALSE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Career Post not found' });
      }

      const updatedNews = result.rows[0];
      await query(
        'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'careerpost_marked_for_deletion',
          id,
          `Career Post deletion by ${userId}.Has been Canceled`,
          userId,
          'editor',
          false
        ]
      );
      res.status(200).json(updatedNews);
    } catch (error) {
      console.error('Error canceling career post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get a single job posting by ID
  GetCareerById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query('SELECT * FROM careers WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching a job posting:', error);
      res.status(500).json({ message: 'Error fetching a job posting.' });
    }
  },

  // Update a job posting
  UpdateCareer: async (req, res) => {
    const { id } = req.params;
    const { title, description, department, employment_type, location, salary_range, requirements, responsibilities, benefits, status, application_deadline, created_by, user_id, posted_date } = req.body;

    try {

      const existingcareer = await query('SELECT * FROM careers WHERE id = $1', [id]);
      if (existingcareer.rows.length === 0) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
      // Determine the new status based on role
      let careerStatus = status;
      if (role === 'editor') {
        careerStatus = 'pending';
      } else if (role === 'administrator' && status === 'pending') {
        careerStatus = 'published';
      }
      const result = await query(
        'UPDATE careers SET title = $1, description = $2, department = $3, job_type = $4, location = $5, salary_range = $6, closing_date = $7,status = $8,requirements = $9,responsibilities = $10,benefits = $11,created_by = $12,posted_date = $13 WHERE id = $14 RETURNING *',
        [title, description, department, employment_type, location, salary_range, application_deadline, status, requirements, responsibilities, benefits, created_by, posted_date]
      );

      if (careerStatus === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'careerpost_updated',
            title,
            `Career Post "${title}" has been updated and is pending approval.`,
            user_id,
            'administrator',
            false
          ]
        );
      }
      res.status(200).json({ message: 'Job posting updated successfully', career: result.rows[0] });
    } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({ message: 'Error updating job posting.' });
    }
  },

  // Soft delete a job posting
  DeleteCareer: async (req, res) => {
    const { id } = req.params;
    const { role, user_id } = req.body;
    try {
      if (role === 'editor') {
        const result = await query('UPDATE careers SET isdeleted = TRUE WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Job posting not found.' });
        }

        // Notify the administrator about the deletion request
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'careerpost_marked_for_deletion',
            id,
            `Career Posts has been marked for deletion by editor with ID ${user_id}.`,
            user_id, // Editor who made the request
            'administrator', // Notify administrators
            false // Mark as unread
          ]
        );
        res.status(200).json({ message: 'Job posting marked as deleted.', career: result.rows[0] });
      } else if (role === 'administrator') {
        // Check if a deletion request notification was already sent
        const notificationResult = await query(
          'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
          ['careerpost_marked_for_deletion', id]
        );

        let existingUserId = null;

        if (notificationResult.rows.length > 0) {
          // If a notification exists, get the original requestor's user ID
          existingUserId = notificationResult.rows[0].sender_id;

        }

        const result = await query('DELETE FROM careers WHERE  id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Job posting not found.' });
        }

        // Notify the editor if deletion was previously requested
        if (existingUserId) {
          await query(
            'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
            [
              'careerpost_deletion_approved',
              id,
              `Career Post deletion has been approved by administrator with ID ${user_id}.`,
              existingUserId, // Notify the editor who made the request
              'editor', // Notify editor
              false // Mark as unread
            ]
          );
        }

        return res.status(200).json({
          message: 'Career Post deleted successfully.',
          career: result.rows[0],
        });

      }
    } catch (error) {
      console.error('Error deleting job posting:', error);
      res.status(500).json({ message: 'Error deleting job posting.' });
    }
  },

  ApproveCareer: async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch the career posting by its ID
      const careerResult = await query('SELECT title FROM careers WHERE id = $1', [id]);

      // Check if the career exists
      if (careerResult.rows.length === 0) {
        return res.status(404).json({ message: 'Career posting not found.' });
      }

      const filename = careerResult.rows[0].title;

      // Check if there is an existing notification for this career
      const existingNotification = await query(
        'SELECT sender_id FROM notifications WHERE (notification_type = $1 OR notification_type = $2) AND item_id = $3',
        ['career_uploaded', 'career_updated', filename]
      );

      if (existingNotification.rows.length > 0) {
        // If an existing notification is found, use its sender_id
        const senderIdToUse = existingNotification.rows[0].sender_id;

        // Update the career status to 'approved' or 'published'
        const result = await query(
          'UPDATE careers SET status = $1 WHERE id = $2 RETURNING *',
          ['published', id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Career posting not found.' });
        }

        // Create a notification for the career approval
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'career_approved',
            id,
            `Career posting has been approved for publishing.`,
            senderIdToUse,
            'editor',
            false
          ]
        );

        res.status(200).json({ message: 'Career posting approved successfully', career: result.rows[0] });
      } else {
        res.status(404).json({ message: 'No existing notification found for this career.' });
      }
    } catch (error) {
      console.error('Error approving career posting:', error);
      res.status(500).json({ message: 'Error approving the career posting.' });
    }
  },

  // Apply for a job
  ApplyForJob: async (req, res) => {
    const { career_id, first_name, last_name, email, phone, cover_letter } = req.body;
    const resumeFile = req.file;

    try {
      let resumeUrl = null;
      if (resumeFile) {
        const cloudinaryResult = await cloudinary.uploader.upload(resumeFile.path, { folder: 'resumes' });
        resumeUrl = cloudinaryResult.secure_url;
      }

      const result = await query(
        `INSERT INTO career_applications (career_id, first_name, last_name, email, phone, resume, cover_letter) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [career_id, first_name, last_name, email, phone, resumeUrl, cover_letter]
      );

      res.status(201).json({ message: 'Job application submitted successfully', application: result.rows[0] });
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ message: 'Error submitting job application.' });
    }
  },

  // Get all job applications
  GetAllApplications: async (req, res) => {
    try {
      const result = await query('SELECT * FROM career_applications ORDER BY applied_date DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ message: 'Error fetching job applications.' });
    }
  }
};
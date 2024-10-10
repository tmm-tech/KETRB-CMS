const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add a new program
  AddProgram: async (req, res) => {
    const { title, content, publishedDate, author, status, user_id} = req.body;
    const image = req.file;

    try {
      // Upload the image to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(image.path, {
        folder: 'programs' // Specify the folder in Cloudinary
      });
      const imagePath = cloudinaryResult.secure_url; // Get the URL of the uploaded image

      const result = await query(
        'INSERT INTO programs (title, content, image, published_date, author, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, imagePath, publishedDate, author, status]
      );
      // Notify admins for approval if status is pending
      if (status === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'programs_uploaded',
	     title,
            `Program article "${title}" uploaded by ${author} pending approval.`,
            user_id,  // The editor's ID
            'administrator',  // Notify all admins
            false     // Not read yet
          ]
        );
      }
      res.status(201).json({ message: 'Program added successfully', program: result.rows[0] });
    } catch (error) {
      console.error('Error adding program:', error);
      res.status(500).json({ message: 'Server error while adding the program.' });
    }
  },

  // Cancel a program
  CancelProgram: async (req, res) => {
    const { id } = req.params;
    const { user_id} = req.body;
    try {
    // Check if there's a deletion request notification for the image
    const notificationResult = await query(
      'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
      ['program_marked_for_deletion', id]
    );

    // If a notification for the deletion request exists, get the user_id
    let userId = null;
    if (notificationResult.rows.length > 0) {
      userId = notificationResult.rows[0].sender_id;
    }
      const result = await query(
        'UPDATE programs SET isdeleted = FALSE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }

      const updatedProgram = result.rows[0];
	    await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'program_deletion_canceled',
	     id,
            `program article deletion.Has been Canceled`,
             userId,
            'editor',
            false
          ]
        );
      res.status(200).json(updatedProgram);
    } catch (error) {
      console.error('Error canceling program:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all programs
  GetPrograms: async (req, res) => {
    try {
      const result = await query('SELECT * FROM programs ORDER BY created_at DESC');
      const programs = result.rows;

      const programsWithImageUrls = programs.map(program => ({
        ...program,
        imageUrl: program.image 
      }));

      res.status(200).json(programsWithImageUrls);
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.status(500).json({ message: 'Error fetching programs.' });
    }
  },

  // Get a single program by ID
  GetProgramById: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query('SELECT * FROM programs WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }

      const program = result.rows[0];

      // Return the program data with the existing Cloudinary URL
      res.status(200).json({
        ...program,
        imageUrl: program.image // Assuming image contains the full Cloudinary URL
      });
    } catch (error) {
      console.error('Error fetching program:', error);
      res.status(500).json({ message: 'Error fetching the program.' });
    }
  },

  // Update an existing program
  UpdateProgram: async (req, res) => {
    const { id } = req.params;
    const { title, content, publishedDate, author, status, role, user_id} = req.body;
    const image = req.file;

    try {
      const existingProgram = await query('SELECT * FROM programs WHERE id = $1', [id]);
      if (existingProgram.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }

      let newStatus = status; 
      if (role === 'editor') {
        programStatus = 'pending';
      } else if (role === 'administrator' && status === 'pending') {
        programStatus = 'published';
      }

      let imagePath;
      if (image) {
        // Upload new image to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(image.path, {
          folder: 'programs'
        });
        imagePath = cloudinaryResult.secure_url; // Get the URL of the new image
      } else {
        imagePath = existingProgram.rows[0].image; // Use existing image if no new one is provided
      }

      const result = await query(
        'UPDATE programs SET title = $1, content = $2, image = $3, published_date = $4, author = $5, status = $6 WHERE id = $7 RETURNING *',
        [title, content, imagePath, publishedDate, author, programStatus, id]
      );

 // Notify admin if the update changes status to pending
      if (programStatus === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'program_updated',
	     title,
            `Program article "${title}" has been updated and is pending approval.`,
            user_id,
            'administrator',
            false
          ]
        );
      }
      res.status(200).json({ message: 'Program updated successfully', program: result.rows[0] });
    } catch (error) {
      console.error('Error updating program:', error);
      res.status(500).json({ message: 'Error updating the program.' });
    }
  },

  // Approve a program (set its status to 'published')
  ApproveProgram: async (req, res) => {
    const { id } = req.params;

    try {
	const programResult = await query('SELECT title FROM programs WHERE id = $1', [id]);

    // Check if the image exists
    if (programResult.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    const filename = programResult.rows[0].title; 
   const existingNotification = await query(
            'SELECT sender_id FROM notifications WHERE (notification_type = $1 OR notification_type = $2) AND item_id = $3',
            ['programs_uploaded', 'program_updated', filename] // Check for both notification types
        );

    if (existingNotification.rows.length > 0) {
      // If an existing notification is found, use its sender_id
      const senderIdToUse = existingNotification.rows[0].sender_id;
	    
      const result = await query(
        'UPDATE programs SET status = $1 WHERE id = $2 RETURNING *',
        ['published', id]
      );
       await query(
        'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'program_approved',
	   filename,
          `Program article has been approved for publishing.`,
          senderIdToUse, // System notification, no specific sender
          'editor',
          false
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }
   
    
      res.status(200).json({ message: 'Program approved successfully', program: result.rows[0] });
    }
    } catch (error) {
      console.error('Error approving program:', error);
      res.status(500).json({ message: 'Error approving the program.' });
    }
  },



  // Delete a program
  DeleteProgram: async (req, res) => {
    const { id } = req.params;
    const { role,user_id} = req.body;

    try {
      if (role === 'editor') {
        const result = await query(
          'UPDATE programs SET isdeleted = TRUE WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Program not found.' });
        }
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'program_marked_for_deletion',
	     id,
            `program article has been marked for deletion by ${user_id}.`,
             user_id,
            'administrator',
            false
          ]
        );
        return res.status(200).json({
          message: 'Program marked for deletion. Admin approval required.',
          program: result.rows[0],
        });
      } else if (role === 'administrator') {
      // Check if a deletion request notification was already sent
      const notificationResult = await query(
        'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
        ['program_marked_for_deletion', id]
      );

      if (notificationResult.rows.length > 0) {
        const existingUserId = notificationResult.rows[0].sender_id;
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'program_deletion_approved',
	     id,
            `program article has been approved for deletion by ${user_id}.`,
             existingUserId,
            'editor',
            false
          ]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Program not found.' });
        }

        return res.status(200).json({
          message: 'Program deleted successfully',
          program: result.rows[0],
        });
      }else {
         const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Program not found.' });
        }

        return res.status(200).json({
          message: 'Program deleted successfully',
          program: result.rows[0],
        });
      }
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      return res.status(500).json({ message: 'Error deleting the program.' });
    }
  },

}

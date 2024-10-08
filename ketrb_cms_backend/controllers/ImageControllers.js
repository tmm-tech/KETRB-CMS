const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add multiple images
  AddImage: async (req, res) => {
    const { status, user_id} = req.body; // Add user_id and role
    const files = req.files;

    // Check if files are uploaded
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const registeredAt = new Date();
    const insertedImages = [];

    try {
      for (const file of files) {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'gallery',
        });

        const imageUrl = uploadResult.secure_url;
        const filename = file.originalname;

        // Insert image details into database
        const result = await query(
          'INSERT INTO images (filepath, image, status, registered_at, caption) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [imageUrl, filename, status, registeredAt, 'NULL']
        );

        insertedImages.push(result.rows[0]);
       if (status == "pending"){
        // Add notification for admin approval
        await query(
          'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'image_uploaded',
             filename,
            `Image "${filename}" uploaded by editor pending approval.`,
             user_id,  // The editor's ID
            'administrator',  // Notification for admin
            false, // Not read yet
          ]
        );
      }
    }

      res.status(201).json({
        message: 'Images uploaded successfully. Admin approval required.',
        images: insertedImages,
      });
    } catch (error) {
      console.error('Error saving images to database:', error);
      res.status(500).json({ message: 'Error saving image details to database' });
    }
  },
  
updateImageCaption: async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  try {
    const result = await query(
      'UPDATE images SET caption = $1 WHERE id = $2 RETURNING *',
      [caption, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating caption:', error);
    res.status(500).json({ message: 'Error updating caption', error: error.message });
  }
},

  // Cancel an image delete
 CancelImages: async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there's a deletion request notification for the image
    const notificationResult = await query(
      'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
      ['image_deletion_requested', id]
    );

    // If a notification for the deletion request exists, get the user_id
    let userId = null;
    if (notificationResult.rows.length > 0) {
      userId = notificationResult.rows[0].sender_id;
    }

    // Cancel the deletion of the image
    const result = await query(
      'UPDATE images SET isdeleted = FALSE WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Notify editor about delete cancellation request
    if (userId) {
      await query(
        'INSERT INTO notifications (notification_type,item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'image_deletion_cancelled',
          id,
          `Editor requested deletion for image with ID ${id}. Deletion has been cancelled.`,
          userId,  // Use the sender_id from the existing notification
          'editor',  // Notify the admins
          false, // Not read yet
        ]
      );
    }

    const updatedImage = result.rows[0];
    res.status(200).json(updatedImage);
  } catch (error) {
    console.error('Error canceling image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},



    
  // Get a specific image by ID
  getAImage: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query('SELECT * FROM images WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving image', error });
    }
  },
  
UpdateImage: async (req, res) => {
  const { id } = req.params;
  const { status, user_id, role } = req.body; // Add user_id and role

  try {
    // Get the image details
    const imageResult = await query('SELECT image FROM images WHERE id = $1', [id]);

    // Check if the image exists
    if (imageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const filename = imageResult.rows[0].image; // Assuming `image` stores the filename or URL

    // Check for existing notifications for this image
    const existingNotification = await query(
      'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
      ['image_uploaded', filename] // Use filename or image ID depending on your logic
    );

    if (existingNotification.rows.length > 0) {
      // If an existing notification is found, use its sender_id
      const senderIdToUse = existingNotification.rows[0].sender_id;

      // Update the image status
      await query('UPDATE images SET status = $1 WHERE id = $2', [status, id]);

      // Create a new notification for the status update
      await query(
        'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'image_status_updated',
          filename,  // Use the image filename or ID as item_id
          `Image "${filename}" updated by editor, pending administrator approval.`,
          senderIdToUse,  // Use the sender_id from the existing notification
          'editor',        // Notify editor
          false           // Not read yet
        ]
      );

      return res.status(200).json({ message: 'Image status updated successfully. Admin review required.' });
    }

    // If no existing notification, do not send any notification as per your requirement
    res.status(200).json({ message: 'Image status updated successfully, but no notification was sent.' });

  } catch (error) {
    console.error('Error updating image status:', error);
    res.status(500).json({ message: 'Error updating image status', error });
  }
},
  
// Delete an image
DeleteImage: async (req, res) => {
  const { id } = req.params;
  const { role, user_id } = req.body; // Assuming user_id is passed in the request body

  try {
    if (role === 'editor') {
      // Mark the image as deleted (pending admin approval)
      const result = await query(
        'UPDATE images SET isdeleted = TRUE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Image not found.' });
      }

      // Notify admin about the deletion request
      await query(
        'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'image_deletion_requested',
          id,
          `Editor requested deletion for image with ID ${id}.`,
          user_id, // Use the user_id from the request
          'administrator', // Notify administrators
          false, // Not read yet
        ]
      );

      return res.status(200).json({
        message: 'Image marked for deletion. Admin approval required.',
        image: result.rows[0], // Returning the updated image status
      });
    } else if (role === 'administrator') {
      // Check if a deletion request notification was already sent
      const notificationResult = await query(
        'SELECT sender_id FROM notifications WHERE notification_type = $1 AND item_id = $2',
        ['image_deletion_requested', id]
      );

      let existingUserId = null;

      // If a notification exists, get the original requestor's user ID
      if (notificationResult.rows.length > 0) {
        existingUserId = notificationResult.rows[0].sender_id;
      }

      // Proceed with the deletion
      await query('DELETE FROM images WHERE id = $1', [id]);

      // Notify the editor (or whoever requested the deletion) that the deletion has been approved
      if (existingUserId) {
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'image_deletion_approved',
            id,
            `Administrator approved the deletion of image with ID ${id}.`,
            existingUserId,  // Notify the original editor
            'editor',        // Notify the editor who made the request
            false,           // Not read yet
          ]
        );
      }

      return res.status(200).json({
        message: 'Image deleted successfully. Editor notified of deletion approval.',
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image', error });
  }
},
//Get published images
getAllPublishedImage: async (req, res) => {
    try {
      const result = await query('SELECT * FROM images WHERE status = $1',['published']);

      const images = result.rows;

      if (images.length === 0) {
        return res.status(200).json({ message: 'No images found', images: [] });
      }

      const imagesWithUrl = images.map((image) => ({
        ...image,
        url: image.filepath, // Cloudinary URL from the database
        status: image.status,
        registered_at: image.registered_at,
        title: image.image, // Assuming 'image' refers to the title or filename
      }));

      res.status(200).json({
        message: 'Images retrieved successfully',
        images: imagesWithUrl,
      });
    } catch (error) {
      console.error('Error retrieving images:', error);
      res.status(500).json({
        message: 'Error retrieving images',
        error: error.message,
      });
    }
  },
  // Get all images
  getAllImage: async (req, res) => {
    try {
      const result = await query('SELECT * FROM images');

      const images = result.rows;

      if (images.length === 0) {
        return res.status(200).json({ message: 'No images found', images: [] });
      }

      const imagesWithUrl = images.map((image) => ({
        ...image,
        url: image.filepath, // Cloudinary URL from the database
        status: image.status,
        registered_at: image.registered_at,
        title: image.image, // Assuming 'image' refers to the title or filename
      }));

      res.status(200).json({
        message: 'Images retrieved successfully',
        images: imagesWithUrl,
      });
    } catch (error) {
      console.error('Error retrieving images:', error);
      res.status(500).json({
        message: 'Error retrieving images',
        error: error.message,
      });
    }
  },
};

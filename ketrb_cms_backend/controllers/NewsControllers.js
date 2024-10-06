const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  AddNews: async (req, res) => {
    const { title, content, publishedDate, author, status } = req.body;
    const image = req.file;

    // Ensure the image is provided
    if (!image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    try {
      // Upload the image to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(image.path, {
        folder: 'news' // Specify the folder in Cloudinary
      });

      const imagePath = cloudinaryResult.secure_url; // Get the secure URL from Cloudinary

      const result = await query(
        'INSERT INTO news (title, content, image, published_date, author, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, imagePath, publishedDate, author, status]
      );
 // Notify admins for approval if status is pending
      if (status === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5)',
          [
            'news_uploaded',
            `News article "${title}" uploaded by ${author} pending approval.`,
            user_id,  // The editor's ID
            'administrator',  // Notify all admins
            false     // Not read yet
          ]
        );
      }
      res.status(201).json({ message: 'News article added successfully', news: result.rows[0] });
    } catch (error) {
      console.error('Error adding news:', error);
      res.status(500).json({ message: 'Server error while adding the news article.' });
    }
  },

  // Cancel a news article
  CancelNews: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query(
        'UPDATE news SET isdeleted = FALSE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'News article not found' });
      }

      const updatedNews = result.rows[0];
      await query(
          'INSERT INTO notifications (notification_type, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5)',
          [
            'news_marked_for_deletion',
            `News article "${news.title}" deletion by ${user_id}.Has been Canceled`,
            user_id,
            'editor',
            false
          ]
        );
      res.status(200).json(updatedNews);
    } catch (error) {
      console.error('Error canceling news article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all news articles
 GetNews: async (req, res) => {
  try {
    const result = await query('SELECT * FROM news ORDER BY created_at DESC');
    const news = result.rows;

    const newsWithImageUrls = news.map(item => ({
      ...item,
      imageUrl: item.image || null, // Use the image field directly, or null if it doesn't exist
    }));

    res.status(200).json(newsWithImageUrls);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news.' });
  }
},


  // Get a single news article by ID
  GetNewsById: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query('SELECT * FROM news WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'News article not found.' });
      }

      const news = result.rows[0];
      const imageUrl = news.image;
      const newsWithImageUrl = { ...news, imageUrl };

      res.status(200).json(newsWithImageUrl);
    } catch (error) {
      console.error('Error fetching news article:', error);
      res.status(500).json({ message: 'Error fetching the news article.' });
    }
  },

// Update an existing news article
UpdateNews: async (req, res) => {
  const { id } = req.params;
  const { title, content, publishedDate, author, status, role } = req.body;
  const image = req.file;

  try {
    // Check if the news article exists
    const existingNews = await query('SELECT * FROM news WHERE id = $1', [id]);
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ message: 'News article not found.' });
    }

    // Determine the new status based on role
    let newStatus = status;
    if (role === 'editor') {
      newStatus = 'pending';
    } else if (role === 'administrator' && status === 'pending') {
      newStatus = 'published';
    }

    // Handle image upload to Cloudinary
    let imagePath;
    if (image) {
      // Upload new image to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(image.path, {
        folder: 'news'
      });
      imagePath = cloudinaryResult.secure_url; // Get the URL of the new image
    } else {
      imagePath = existingNews.rows[0].image; // Use the existing image if no new one is provided
    }

    // Update the news article in the database
    const result = await query(
      'UPDATE news SET title = $1, content = $2, image = $3, published_date = $4, author = $5, status = $6 WHERE id = $7 RETURNING *',
      [title, content, imagePath, publishedDate, author, newStatus, id]
    );
 if (newStatus === 'pending') {
        await query(
          'INSERT INTO notifications (notification_type, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5)',
          [
            'news_updated',
            `News article "${title}" has been updated and is pending approval.`,
            user_id,
            'administrator',
            false
          ]
        );
    }
    // Respond with the updated news article
    res.status(200).json({ message: 'News article updated successfully', news: result.rows[0] });
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ message: 'Error updating the news article.' });
  }
},

  // Approve a news article (set its status to 'published')
  ApproveNews: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query(
        'UPDATE news SET status = $1 WHERE id = $2 RETURNING *',
        ['published', id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'News article not found.' });
      }
       await query(
        'INSERT INTO notifications (notification_type, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5)',
        [
          'news_approved',
          `News article "${news.title}" has been approved for publishing.`,
          null, // System notification, no specific sender
          'editor',
          false
        ]
      );

      res.status(200).json({ message: 'News article approved successfully', news: result.rows[0] });
    } catch (error) {
      console.error('Error approving news article:', error);
      res.status(500).json({ message: 'Error approving the news article.' });
    }
  },

  // Delete a news article
  DeleteNews: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      if (role === 'editor') {
        const result = await query(
          'UPDATE news SET isdeleted = TRUE WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'News article not found.' });
        }
        await query(
          'INSERT INTO notifications (notification_type, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5)',
          [
            'news_marked_for_deletion',
            `News article "${news.title}" has been marked for deletion by ${user_id}.`,
            user_id,
            'administrator',
            false
          ]
        );

        return res.status(200).json({
          message: 'News article marked for deletion. Admin approval required.',
          news: result.rows[0],
        });
      } else {
        const result = await query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'News article not found.' });
        }

        return res.status(200).json({
          message: 'News article deleted successfully',
          news: result.rows[0],
        });
      }
    } catch (error) {
      console.error('Error deleting news article:', error);
      return res.status(500).json({ message: 'Error deleting the news article.' });
    }
  },
};

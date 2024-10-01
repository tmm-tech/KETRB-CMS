const { query } = require('../config/sqlConfig');
const path = require('path');
const fs = require('fs');
module.exports = {
  // Add a new news article
  AddNews: async (req, res) => {
    const { title, content, publishedDate, author, status } = req.body;
    const image = req.file;

    try {
      const imagePath = `news/${image.filename}`;
      const result = await query(
        'INSERT INTO news (title, content, image, published_date, author, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, imagePath, publishedDate, author, status]
      );
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
    
    // Map over the news to construct the full image URL for each one
    const newsWithImageUrls = news.map(new => {
      // If the image exists, construct the full image URL
      const imageUrl = new.image 
        ? `${req.protocol}://${req.get('host')}/${new.image}`
        : null; // Handle case where image doesn't exist

      // Return the news with the full image URL
      return {
        ...new,
        imageUrl
      };
    });

    // Return the news data with constructed image URLs
    res.status(200).json(newsWithImageUrls);
    } catch (error) {
      console.error('Error fetching news articles:', error);
      res.status(500).json({ message: 'Error fetching news articles.' });
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
      const imageUrl = `${req.protocol}://${req.get('host')}/${news.image}`;
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
      const existingNews = await query('SELECT * FROM news WHERE id = $1', [id]);
      if (existingNews.rows.length === 0) {
        return res.status(404).json({ message: 'News article not found.' });
      }

      let newStatus = status;
      if (role === 'editor') {
        newStatus = 'pending';
      } else if (role === 'administrator' && status === 'pending') {
        newStatus = 'published';
      }

      const imagePath = image ? `news/${image.filename}` : existingNews.rows[0].image;
      const result = await query(
        'UPDATE news SET title = $1, content = $2, image = $3, published_date = $4, author = $5, status = $6 WHERE id = $7 RETURNING *',
        [title, content, imagePath, publishedDate, author, newStatus, id]
      );

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

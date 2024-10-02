const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
	 // Add a new program
  AddProgram: async (req, res) => {
    const { title, content, publishedDate, author, status } = req.body;
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
      res.status(201).json({ message: 'Program added successfully', program: result.rows[0] });
    } catch (error) {
      console.error('Error adding program:', error);
      res.status(500).json({ message: 'Server error while adding the program.' });
    }
  },

  // Cancel a program
  CancelProgram: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query(
        'UPDATE programs SET isdeleted = FALSE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }

      const updatedProgram = result.rows[0];
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
        imageUrl: program.image // Assuming image contains the full Cloudinary URL
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
    const { title, content, publishedDate, author, status, role } = req.body;
    const image = req.file;

    try {
      const existingProgram = await query('SELECT * FROM programs WHERE id = $1', [id]);
      if (existingProgram.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }

      let newStatus = status; 
      if (role === 'editor') {
        newStatus = 'pending';
      } else if (role === 'administrator' && status === 'pending') {
        newStatus = 'published';
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
        [title, content, imagePath, publishedDate, author, newStatus, id]
      );

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
      const result = await query(
        'UPDATE programs SET status = $1 WHERE id = $2 RETURNING *',
        ['published', id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }

      res.status(200).json({ message: 'Program approved successfully', program: result.rows[0] });
    } catch (error) {
      console.error('Error approving program:', error);
      res.status(500).json({ message: 'Error approving the program.' });
    }
  },

  // Delete a program
  DeleteProgram: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
      if (role === 'editor') {
        const result = await query(
          'UPDATE programs SET isdeleted = TRUE WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Program not found.' });
        }

        return res.status(200).json({
          message: 'Program marked for deletion. Admin approval required.',
          program: result.rows[0],
        });
      } else {
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Program not found.' });
        }

        return res.status(200).json({
          message: 'Program deleted successfully',
          program: result.rows[0],
        });
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      return res.status(500).json({ message: 'Error deleting the program.' });
    }
  },

}

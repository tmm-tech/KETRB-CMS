const { query } = require('../config/sqlConfig');
const path = require('path');
const fs = require('fs');
module.exports = {
	// Add a new program
	AddProgram: async (req, res) => {
	  const { title, content, publishedDate, author, status } = req.body;
	  const image = req.file;

	  try {
		const imagePath = `programs/${image.filename}`;
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

	// Get all programs
	GetPrograms: async (req, res) => {
	  try {
		const result = await query('SELECT * FROM programs ORDER BY created_at DESC');
		res.status(200).json(result.rows);
	  } catch (error) {
		console.error('Error fetching programs:', error);
		res.status(500).json({ message: 'Error fetching programs.' });
	  }
	},

	// Get a single program by ID
	GetProgramById: async (req, res) => {
	    const { id } = req.params; // Program ID from the URL
	
	    try {
	        // Query to get the program details, including the image path
	        const result = await query('SELECT * FROM programs WHERE id = $1', [id]);
	
	        if (result.rows.length === 0) {
	            return res.status(404).json({ message: 'Program not found.' });
	        }
	
	        const program = result.rows[0];
	
	        // Construct the full image URL using the stored image path in the 'image' column
	        const imageUrl = `${req.protocol}://${req.get('host')}/${program.image}`; 
		
	        // Add the full image URL to the program object
	        const programWithImageUrl = {
	            ...program,
	            imageUrl // Adding the full image URL to the response
	        };
	
	        // Return the program data with the constructed image URL
	        res.status(200).json(programWithImageUrl);
	
	    } catch (error) {
	        console.error('Error fetching program:', error);
	        res.status(500).json({ message: 'Error fetching the program.' });
	    }
},

	// Update an existing program
	UpdateProgram: async (req, res) => {
    const { id } = req.params;
    const { title, content, publishedDate, author, status } = req.body; // Ensure `status` comes from the client
    const image = req.file;
    const userRole = req.user.role; // Assuming you have user role available in the request

    try {
        // Check if program exists
        const existingProgram = await query('SELECT * FROM programs WHERE id = $1', [id]);
        if (existingProgram.rows.length === 0) {
            return res.status(404).json({ message: 'Program not found.' });
        }

        // Determine the new status
        let newStatus = status; // Default to the status provided in the request
        if (userRole === 'editor') {
            // If the user is an editor, set status to 'Pending'
            newStatus = 'Pending';
        }

        // Update fields, including the image if uploaded
        const imagePath = image ? `programs/${image.filename}` : existingProgram.rows[0].image;
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


	// Approve a program (set its status to 'approved')
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
  const { role } = req.body; // Get the user role from the request body

  try {
    if (role === 'editor') {
      // Soft delete: Set isDeleted to true, requiring admin approval for final deletion
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
    } else if (role === 'administrator') {
      // Hard delete: Permanently delete the program
      const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Program not found.' });
      }

      return res.status(200).json({
        message: 'Program deleted successfully',
        program: result.rows[0],
      });
    } else {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }
  } catch (error) {
    console.error('Error deleting program:', error);
    return res.status(500).json({ message: 'Error deleting the program.' });
  }
},

}

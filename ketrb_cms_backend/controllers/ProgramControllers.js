const { query } = require('../config/sqlConfig');
const path = require('path');
const fs = require('fs');

// Add a new program
AddProgram: async (req, res) => {
  const { title, content, publishedDate, author, status } = req.body;
  const image = req.file;

  if (!title || !content || !publishedDate || !author || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const imagePath = `/uploads/programs/${image.filename}`;
    const result = await query(
      'INSERT INTO programs (title, content, image, published_date, author, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, content, imagePath, publishedDate, author, status]
    );
    res.status(201).json({ message: 'Program added successfully', program: result.rows[0] });
  } catch (error) {
    console.error('Error adding program:', error);
    res.status(500).json({ message: 'Server error while adding the program.' });
  }
};

// Get all programs
GetPrograms: async (req, res) => {
  try {
    const result = await query('SELECT * FROM programs ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs.' });
  }
};

// Get a single program by ID
GetProgramById: async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('SELECT * FROM programs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Error fetching the program.' });
  }
};

// Update an existing program
UpdateProgram: async (req, res) => {
  const { id } = req.params;
  const { title, content, publishedDate, author, status } = req.body;
  const image = req.file;

  try {
    // Check if program exists
    const existingProgram = await query('SELECT * FROM programs WHERE id = $1', [id]);
    if (existingProgram.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    // Update fields, including the image if uploaded
    const imagePath = image ? `/uploads/programs/${image.filename}` : existingProgram.rows[0].image;
    const result = await query(
      'UPDATE programs SET title = $1, content = $2, image = $3, published_date = $4, author = $5, status = $6 WHERE id = $7 RETURNING *',
      [title, content, imagePath, publishedDate, author, status, id]
    );

    res.status(200).json({ message: 'Program updated successfully', program: result.rows[0] });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Error updating the program.' });
  }
};

// Approve a program (set its status to 'approved')
ApproveProgram: async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      'UPDATE programs SET status = $1 WHERE id = $2 RETURNING *',
      ['approved', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    res.status(200).json({ message: 'Program approved successfully', program: result.rows[0] });
  } catch (error) {
    console.error('Error approving program:', error);
    res.status(500).json({ message: 'Error approving the program.' });
  }
};

// Delete a program
DeleteProgram: async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    res.status(200).json({ message: 'Program deleted successfully', program: result.rows[0] });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting the program.' });
  }
},

module.exports = {
  AddProgram,
  GetPrograms,
  GetProgramById,
  UpdateProgram,
  ApproveProgram,
  DeleteProgram,
};

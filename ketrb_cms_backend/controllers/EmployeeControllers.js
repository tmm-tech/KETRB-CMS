const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add a new employee
  AddEmployee: async (req, res) => {
    const { first_name, last_name, job_title, department, role_type, email, phone, hire_date } = req.body;
    const profileImage = req.file;
    
    try {
      let imagePath = null;
      if (profileImage) {
        const cloudinaryResult = await cloudinary.uploader.upload(profileImage.path, { folder: 'employees' });
        imagePath = cloudinaryResult.secure_url;
      }
      
      const result = await query(
        'INSERT INTO employee (first_name, last_name, job_title, department, role_type, email, phone, hire_date, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [first_name, last_name, job_title, department, role_type, email, phone, hire_date, imagePath]
      );
      
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
    const { first_name, last_name, job_title, department, role_type, email, phone, hire_date } = req.body;
    const profileImage = req.file;
    
    try {
      const existingEmployee = await query('SELECT * FROM employee WHERE id = $1', [id]);
      if (existingEmployee.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }

      let imagePath = existingEmployee.rows[0].profile_image;
      if (profileImage) {
        const cloudinaryResult = await cloudinary.uploader.upload(profileImage.path, { folder: 'employees' });
        imagePath = cloudinaryResult.secure_url;
      }
      
      const result = await query(
        'UPDATE employee SET first_name = $1, last_name = $2, job_title = $3, department = $4, role_type = $5, email = $6, phone = $7, hire_date = $8, profile_image = $9 WHERE id = $10 RETURNING *',
        [first_name, last_name, job_title, department, role_type, email, phone, hire_date, imagePath, id]
      );
      
      res.status(200).json({ message: 'Employee updated successfully', employee: result.rows[0] });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Error updating the employee.' });
    }
  },

  // Soft delete an employee
  DeleteEmployee: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query('UPDATE employee SET isdeleted = TRUE WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
      res.status(200).json({ message: 'Employee marked as deleted.', employee: result.rows[0] });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Error deleting the employee.' });
    }
  },
};
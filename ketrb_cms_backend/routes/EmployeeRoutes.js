const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  AddEmployee,
  GetAllEmployees,
  GetEmployeeById,
  UpdateEmployee,
  DeleteEmployee,
} = require('../controllers/EmployeeControllers');

const EmployeeRoutes = express.Router();

// Define the root directory and the upload folder path
const rootDirectory = path.resolve(__dirname, '../public');
const uploadFolderPath = path.join(rootDirectory, 'employees');

// Ensure the upload folder exists
const fs = require('fs');
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath, { recursive: true });
}

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Add a new employee
EmployeeRoutes.post('/add', upload.single('profile_image'), AddEmployee);

// Get all employees
EmployeeRoutes.get('/', GetAllEmployees);

// Get a specific employee by ID
EmployeeRoutes.get('/:id', GetEmployeeById);

// Update an existing employee
EmployeeRoutes.put('/edit/:id', upload.single('profile_image'), UpdateEmployee);

// Soft delete an employee
EmployeeRoutes.delete('/delete/:id', DeleteEmployee);

module.exports = EmployeeRoutes;
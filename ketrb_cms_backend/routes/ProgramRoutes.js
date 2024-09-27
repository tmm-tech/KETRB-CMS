const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  AddProgram,
  GetPrograms,
  GetProgramById,
  UpdateProgram,
  ApproveProgram,
  DeleteProgram,
  CancelProgram,
} = require('../controllers/ProgramControllers');
const ProgramRoutes = express.Router();

// Define the root directory and the upload folder path
const rootDirectory = path.resolve(__dirname, '../public');
const uploadFolderPath = path.join(rootDirectory, 'programs');

// Create the 'uploads/programs' folder inside 'public' if it doesn't exist
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath, { recursive: true });
}

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath); // Use the dynamically created path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Add a new program
ProgramRoutes.post('/add', upload.single('program'), AddProgram);

// Get all programs
ProgramRoutes.get('/', GetPrograms);

// Get a specific program by ID
ProgramRoutes.get('/:id', GetProgramById);

// Update an existing program
ProgramRoutes.put('/edit/:id', upload.single('image'), UpdateProgram);

// Approve a program (change status to "approved")
ProgramRoutes.put('/approve/:id', ApproveProgram);

// Approve a program (change status to "approved")
ProgramRoutes.put('/cancledelete/:id', CancelProgram);

// Delete a program
ProgramRoutes.delete('/delete/:id', DeleteProgram);

module.exports = ProgramRoutes;

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  AddCareer,
  GetAllCareers,
  GetCareerById,
  UpdateCareer,
  DeleteCareer,
  ApplyForJob,
  GetAllApplications,
  ApproveCareer,
  GetPublishedCareers,
  CancelCareer
} = require('../controllers/CareerControllers');

const CareerRoutes = express.Router();

// Configure Multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/resumes')); // Save resumes to /public/resumes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage: storage });


// Get all careers
CareerRoutes.get('/', GetAllCareers); 

// Get all published career posts
CareerRoutes.get('/careers', GetPublishedCareers); 

// Get all applications
CareerRoutes.get('/applications', GetAllApplications);

// Apply for  a job
CareerRoutes.post('/apply', upload.single('resume'), ApplyForJob); 

// Approve a career post
CareerRoutes.put('/approve/:id', ApproveCareer);

// Soft delete a career post
CareerRoutes.put('/cancledelete/:id', CancelCareer);

// Update a career post
CareerRoutes.put('/edit/:id', UpdateCareer);

// Add a new career post
CareerRoutes.put('/add', AddCareer);

// Delet a career post
CareerRoutes.delete('/delete/:id', DeleteCareer);

// Get a specific career post by ID
CareerRoutes.get('/:id', GetCareerById);

module.exports = CareerRoutes;
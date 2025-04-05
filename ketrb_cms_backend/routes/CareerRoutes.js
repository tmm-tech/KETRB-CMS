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
  ApproveCareer
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

// Job posting routes
CareerRoutes.post('/add', AddCareer); // Add a new job posting
CareerRoutes.get('/', GetAllCareers); // Get all job postings
CareerRoutes.get('/:id', GetCareerById); // Get a specific job posting
CareerRoutes.put('/edit/:id', UpdateCareer); // Update a job posting
CareerRoutes.delete('/delete/:id', DeleteCareer); // Delete a job posting
// Approve a career post
CareerRoutes.put('/approve/:id', ApproveCareer);
// Job application routes
CareerRoutes.post('/apply', upload.single('resume'), ApplyForJob); // Apply for a job
CareerRoutes.get('/applications', GetAllApplications); // Get all job applications

module.exports = CareerRoutes;
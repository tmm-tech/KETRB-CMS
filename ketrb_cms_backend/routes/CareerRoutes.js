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

CareerRoutes.get('/', GetAllCareers); 
CareerRoutes.get('/applications', GetAllApplications);
CareerRoutes.post('/apply', upload.single('resume'), ApplyForJob); 
CareerRoutes.put('/approve/:id', ApproveCareer);
CareerRoutes.put('/edit/:id', UpdateCareer); 
CareerRoutes.delete('/delete/:id', DeleteCareer);
CareerRoutes.get('/:id', GetCareerById); 
module.exports = CareerRoutes;
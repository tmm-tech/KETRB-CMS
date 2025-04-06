const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  AddNews,
  GetNews,
  GetNewsById,
  UpdateNews,
  ApproveNews,
  DeleteNews,
  CancelNews,
  GetPublishedNews
} = require('../controllers/NewsControllers');
const NewsRoutes = express.Router();

// Define the root directory and the upload folder path
const rootDirectory = path.resolve(__dirname, '../public');
const uploadFolderPath = path.join(rootDirectory, 'news');

// Create the 'uploads/news' folder inside 'public' if it doesn't exist
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

// Add a new news article
NewsRoutes.post('/add', upload.single('news'), AddNews);

// Get all news articles
NewsRoutes.get('/', GetNews);

// Get all published news articles
NewsRoutes.get('/news', GetPublishedNews);

// Get a specific news article by ID
NewsRoutes.get('/:id', GetNewsById);

// Update an existing news article
NewsRoutes.put('/edit/:id', upload.single('news'), UpdateNews);

// Approve a news article (change status to "approved")
NewsRoutes.put('/approve/:id', ApproveNews);

// Cancel delete for a news article
NewsRoutes.put('/cancledelete/:id', CancelNews);

// Delete a news article
NewsRoutes.delete('/delete/:id', DeleteNews);

module.exports = NewsRoutes;

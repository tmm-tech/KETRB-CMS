const ImageRoutes = require('express').Router();
const {
    AddImage,
    UpdateImage,
    DeleteImage,
    getAImage,
    CancelImage,
    getAllImage
} = require('../controllers/ImageControllers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const rootDirectory = path.resolve(__dirname, '../public');
const uploadFolderPath = path.join(rootDirectory, 'gallery');

// Create the 'gallery' folder inside 'public' if it doesn't exist
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath); // Use the dynamically created path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
// Multer middleware to handle single file upload
const upload = multer({ storage: storage });

// Add a new image
ImageRoutes.post('/add', upload.array('images', 20), AddImage);

// Update an image's status
ImageRoutes.put('/update/:id', UpdateImage);
// Cancel delete for a image
NewsRoutes.put('/cancledelete/:id', CancelImage);
// Delete an image
ImageRoutes.delete('/delete/:id', DeleteImage);

// Get a specific image by ID
ImageRoutes.get('/image/:id', getAImage);

// Get all images
ImageRoutes.get('/allimages', getAllImage);

module.exports = ImageRoutes;

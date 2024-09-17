const ImageRoutes = require('express').Router();
const {
    AddImage,
    UpdateImage,
    DeleteImage,
    getAImage,
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

// Path to the counter file
const counterFilePath = path.join(rootDirectory, 'counter.json');

// Read and update the counter value
const readCounter = async () => {
  if (!fs.existsSync(counterFilePath)) {
    // Initialize counter file if it doesn't exist
    await promisify(fs.writeFile)(counterFilePath, JSON.stringify({ count: 0 }), 'utf8');
  }
  const data = await promisify(fs.readFile)(counterFilePath, 'utf8');
  return JSON.parse(data).count;
};

const updateCounter = async (count) => {
  await promisify(fs.writeFile)(counterFilePath, JSON.stringify({ count }), 'utf8');
};

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath);  // Upload to 'public/gallery'
  },
  filename: async function (req, file, cb) {
    const ext = path.extname(file.originalname);  // Get the original file extension
    const count = await readCounter();
    const fileName = `kertb_img${String(count + 1).padStart(3, '0')}${ext}`;  // Incremental name
    await updateCounter(count + 1);
    cb(null, fileName);
  }
});

// Multer middleware to handle single file upload
const upload = multer({ storage: storage });

// Add a new image
ImageRoutes.post('/add', upload.array('image'), AddImage);

// Update an image's status
ImageRoutes.put('/update/:id', UpdateImage);

// Delete an image
ImageRoutes.delete('/delete/:id', DeleteImage);

// Get a specific image by ID
ImageRoutes.get('/image/:id', getAImage);

// Get all images
ImageRoutes.get('/allimages', getAllImage);

module.exports = ImageRoutes;
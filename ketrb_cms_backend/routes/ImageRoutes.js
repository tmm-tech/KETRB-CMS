const ImageRoutes = require('express').Router();
const {
    AddImage,
    UpdateImage,
    DeleteImage,
    getAImage,
    getAllImage
} = require('../controllers/ImageControllers');


// Add a new image
ImageRoutes.post('/add', AddImage);

// Update an image's status
ImageRoutes.put('/update/:id', UpdateImage);

// Delete an image
ImageRoutes.delete('/delete/:id', DeleteImage);

// Get a specific image by ID
ImageRoutes.get('/image/:id', getAImage);

// Get all images
ImageRoutes.get('/allimages', getAllImage);

module.exports = ImageRoutes;

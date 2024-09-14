const { query } = require('../config/sqlConfig');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


module.exports = {
    // Add an image
    AddImage: async (req, res) => {
        const { image, status } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'No image data provided' });
        }
    
        try {
            // Decode base64 image
            const base64Data = image.replace(/^data:image\/png;base64,/, "");
            const fileName = `${Date.now()}.png`;
            const filePath = path.join(__dirname, '../uploads', fileName);
    
            // Save the image to the server
            await fs.promises.writeFile(filePath, base64Data, 'base64');
    
            // Save image info to the database
            const queryText = 'INSERT INTO images (name, status, image) VALUES ($1, $2, $3)';
            await query(queryText, [fileName, status, filePath]);
    
            res.status(201).json({ message: 'Image uploaded successfully!', filePath });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ message: 'Error uploading image', error });
        }
    },
    // Update an image's status
    UpdateImage: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        try {
            await query('UPDATE images SET status = ? WHERE id = ?', [status, id]);
            res.status(200).json({ message: 'Image status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating image status', error });
        }
    },

    // Delete an image
    DeleteImage: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await query('SELECT image FROM images WHERE id = ?', [id]);
            const imagePath = result[0].path;

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await query('DELETE FROM images WHERE id = ?', [id]);
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting image', error });
        }
    },
    // Get a specific image by ID
    getAImage: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await query('SELECT * FROM images WHERE id = ?', [id]);
            if (result.length > 0) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving image', error });
        }
    },

    // Get all images
    getAllImage: async (req, res) => {
        try {
            const result = await query('SELECT * FROM images');
            if (result.length === 0) {
                // No images found
                return res.status(200).json({ message: 'No images found', images: [] });
            }
    
            // Map over the results to construct the full image URL
            const imagesWithUrl = result.map(image => ({
                ...image,
                url: `${req.protocol}://${req.get('host')}/uploads/${image.name}`, // Construct the full URL for each image
                status: image.status,   // Include the status
                registered_at: image.registered_at  // Include the registration date
            }));

            res.status(200).json(imagesWithUrl);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving images', error });
        }
    },
}

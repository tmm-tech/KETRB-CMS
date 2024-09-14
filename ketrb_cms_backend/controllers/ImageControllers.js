const { query } = require('../config/sqlConfig');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


module.exports = {
    // Add an image
    AddImage: async (req, res) => {
        const { status, image } = req.body; // Expecting base64 string in 'image'

        if (!image) {
            return res.status(400).send('No image provided.');
        }

        try {
            // Extract base64 data
            const base64Data = image.replace(/^data:image\/png;base64,/, "");
            const imageName = `ketrb_img${Date.now()}.png`;
            const imagePath = path.join(__dirname, '../uploads', imageName);

            // Write image to file
            await fs.promises.writeFile(imagePath, base64Data, 'base64');

            // Save image info to the database
            await query('INSERT INTO images (name, status, image) VALUES (?, ?, ?)', [imageName, status, imagePath]);

            res.status(201).json({ message: 'Image uploaded successfully', imageName, status });
        } catch (error) {
            console.log('Error uploading image:', error);
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
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving images', error });
        }
    },
}

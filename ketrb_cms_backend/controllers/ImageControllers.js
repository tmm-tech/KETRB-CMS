const { query } = require('../config/sqlConfig');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); 

module.exports = {
    // Add an image
    AddImage: [
        upload.single('image'), // 'image' should match the name in FormData
        
        async (req, res) => {
            const { status } = req.body;
            const image = req.file;
            console.log('Request file:', req.file); // Check if the file is present
            console.log('Request body:', req.body); // Check if other fields are present
            
            const imageName = `ketrb_img${Date.now()}${path.extname(image.originalname)}`;
            const imagePath = path.join(__dirname, '../uploads', imageName);
            console.log('File uploaded to:', imagePath);
            try {
                await fs.promises.rename(image.path, imagePath);
    
                // Save image info to the database
                await query('INSERT INTO images (name, status, image) VALUES (?, ?, ?)', [imageName, status, imagePath]);
    
                res.status(201).json({ message: 'Image uploaded successfully', imageName, status });
            } catch (error) {
                console.error('Error uploading image:', error);
                res.status(500).json({ message: 'Error uploading image', error });
            }
        }
    ],
    
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
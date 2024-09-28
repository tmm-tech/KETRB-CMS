const { query } = require('../config/sqlConfig');
const path = require('path');
const fs = require('fs');

module.exports = {
    // Add multiple images
    AddImage: async (req, res) => {
        const { status } = req.body;
        const files = req.files; // Changed to handle multiple files

        // Check if files are uploaded
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Ensure the correct file path is saved
        const registeredAt = new Date(); // Get the current timestamp
        const insertedImages = [];

        try {
            for (const file of files) {
                const imageUrl = `gallery/${file.filename}`; // Use the correct 'gallery' folder
                const filename = file.filename;

                // Insert image details into PostgreSQL
                const result = await query(
                    'INSERT INTO images (filepath, image, status, registered_at) VALUES ($1, $2, $3, $4) RETURNING *',
                    [imageUrl, filename, status, registeredAt]
                );

                // Collect inserted image data
                insertedImages.push(result.rows[0]);
            }

            // Return success message and the newly inserted image data
            res.status(201).json({
                message: 'Images uploaded successfully',
                images: insertedImages, // Return all inserted rows
            });
        } catch (error) {
            console.error('Error saving images to database:', error);
            res.status(500).json({ message: 'Error saving image details to database' });
        }
    },
    
    UpdateImage: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        try {
            await query('UPDATE images SET status = $1 WHERE id = $2', [status, id]);
            res.status(200).json({ message: 'Image status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating image status', error });
        }
    },

    // Delete an image
    DeleteImage: async (req, res) => {
        const { id } = req.params;

        try {
            await query('DELETE FROM images WHERE id = $1', [id]);
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting image', error });
        }
    },
    // Get a specific image by ID
    getAImage: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await query('SELECT * FROM images WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
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

            const images = result.rows;

            if (images.length === 0) {
                return res.status(200).json({ message: 'No images found', images: [] });
            }

            const imagesWithUrl = images.map(image => ({
                ...image,
                url: `${req.protocol}://${req.get('host')}/gallery/${path.basename(image.filepath)}`,
                status: image.status,
                registered_at: image.registered_at,
                title: image.image // Assuming 'filename' refers to the title
            }));

            res.status(200).json({
                message: 'Images retrieved successfully',
                images: imagesWithUrl
            });
        } catch (error) {
            console.error("Error retrieving images:", error);
            res.status(500).json({
                message: 'Error retrieving images',
                error: error.message
            });
        }
    },
}

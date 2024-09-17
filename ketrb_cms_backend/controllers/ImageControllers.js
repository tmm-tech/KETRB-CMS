const { query } = require('../config/sqlConfig');
const path = require('path');
const fs = require('fs');


module.exports = {
    // Add an image
    AddImage: async (req, res) => {
        const { status } = req.body;
        const files = req.files;
        console.log("File: ", req.file);

        // Check if a file is uploaded
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Ensure the correct file path is saved
        const imageUrl = `gallery/${file.filename}`; // Updated to use the correct 'gallery' folder
        const registeredAt = new Date(); // Get the current timestamp
        const filename = file.filename;

        try {
            // Insert image details into PostgreSQL
            const result = await query(
                'INSERT INTO images (filepath, image, status, registered_at) VALUES ($1, $2, $3, $4) RETURNING *',
                [imageUrl, filename, status, registeredAt]
            );

            // Return success message and the newly inserted image data
            res.json({
                message: 'Image uploaded successfully',
                image: result.rows[0], // Return the inserted row
            });
        } catch (error) {
            console.error('Error saving image to database:', error);
            res.status(500).json({ message: 'Error saving image details to database' });
        }
    },
    // Update an image's status
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
            const result = await query('SELECT image FROM images WHERE id = $1', [id]);
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
            const result = await query('SELECT * FROM images WHERE id = $1', [id]);
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
            // Query to retrieve all images from the database
            const result = await query('SELECT * FROM images');

            // Extract the rows from the result
            const images = result.rows;

            // Check if the images array is empty
            if (images.length === 0) {
                return res.status(200).json({ message: 'No images found', images: [] });
            }

            // Map over the images and construct the full image URL
            const imagesWithUrl = images.map(image => ({
                ...image,
                url: `${req.protocol}://${req.get('host')}/gallery/${path.basename(image.filepath)}`, // Correct URL path to 'gallery'
                status: image.status,
                registered_at: image.registered_at,
                title: image.image // Assuming 'filename' refers to the title
            }));

            // Return the response with the retrieved images and full URLs
            res.status(200).json({
                message: 'Images retrieved successfully',
                images: imagesWithUrl
            });
        } catch (error) {
            console.error("Error retrieving images:", error);
            res.status(500).json({
                message: 'Error retrieving images',
                error: error.message // Include error details for debugging
            });
        }
    },
}

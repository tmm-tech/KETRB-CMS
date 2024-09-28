const express = require('express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserRoutes = require('./routes/UserRoutes');
const ImageRoutes = require('./routes/ImageRoutes');
const ProgramRoutes = require('./routes/ProgramRoutes');
const NewsRoutes = require('./routes/NewsRoutes'); // Include the NewsRoutes
const cookieParser = require('cookie-parser');

const app = express(); 

// Middleware setup
app.use(cookieParser());

const corsOptions = {
  origin: 'https://ketrb-cms-one.vercel.app', // Your frontend URL
  credentials: true, // Allow cookies to be sent
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Allowed headers
};
app.use(cors(corsOptions));

// Static files and views
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve images from 'gallery', 'program', and 'news' folders inside public
app.use('/gallery', express.static(path.join(__dirname, 'public', 'gallery')));
app.use('/program', express.static(path.join(__dirname, 'public', 'program')));
app.use('/news', express.static(path.join(__dirname, 'public', 'news')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources/views"));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware to add token to the request
const addTokenToRequest = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' from the beginning
        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            req.token = decodedToken;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    }
    next();
};

app.use(addTokenToRequest);

// Route handling
app.use('/users', UserRoutes);
app.use('/images', ImageRoutes);
app.use('/programs', ProgramRoutes);
app.use('/news', NewsRoutes); // Include the news routes
app.get('/', (req, res) => {
    res.json({ message: "Confirmed Connection to KETRB CMS" });
});

app.get('/check-file/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, 'public', folder, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).json({ message: 'File not found' });
        }
        // File exists
        return res.status(200).json({ message: 'File exists', filePath });
    });
});

// Server setup
const port = process.env.PORT || 4080;
app.listen(port, () => {
    console.log(`Authentication Server Listening on port: ${port}`);
});

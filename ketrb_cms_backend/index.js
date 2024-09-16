const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserRoutes = require('./routes/UserRoutes');
const cookieParser = require('cookie-parser');
const ImageRoutes = require('./routes/ImageRoutes');
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
app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/', (req, res) => {
    res.json({ message: "Confirmed Connection to KETRB CMS" });
});

// Server setup
const port = process.env.PORT || 4080;
app.listen(port, () => {
    console.log(`Authentication Server Listening on port: ${port}`);
});
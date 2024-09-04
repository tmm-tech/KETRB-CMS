const jwt = require('jsonwebtoken');
const { verifyToken } = require('../services/jwtServices');

// Middleware to validate JWT token for local users
function validateTokenUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = verifyToken(token); // Ensure this function handles token verification
        if (decodedToken.message) {
            return res.status(401).json({ message: decodedToken.message });
        }
        req.user = decodedToken; // Optionally attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}

// Middleware to validate JWT token for foreign users
function validateJwtTokenForeign(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.FOREIGN_ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = {
    validateTokenUser,
    validateJwtTokenForeign
};
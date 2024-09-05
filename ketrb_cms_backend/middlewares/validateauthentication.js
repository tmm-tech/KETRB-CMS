const jwt = require('jsonwebtoken');
const { verifyToken } = require('../services/jwtServices');


function validateTokenUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = verifyToken(token); 
        if (decodedToken.message) {
            return res.status(401).json({ message: decodedToken.message });
        }
        req.user = decodedToken; 
        next();
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}


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
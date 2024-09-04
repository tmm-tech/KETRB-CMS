const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { validateJwtTokenForeign } = require('./middlewares/validateauthentication');
const UserRoutes = require('./routes/UserRoutes');


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const addTokenToRequest = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
            req.token = decodedToken;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    }
    next();
};

app.use(addTokenToRequest);


const redirect = (proxyReq, req, res, options) => {
    const valid = validateJwtTokenForeign(proxyReq, req, res);
    if (valid === true) {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        } else {
            proxyReq.setHeader('X-Forwarded-For', req.ip);
        }
    } else if (valid === 401) {
        res.status(401).json({ message: "Authorization header is missing" });
    } else {
        res.status(401).json({ message: valid });
    }
};


app.use('/users', UserRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Confirmed Connection to KETRB CMS" });
});

// Server setup
const port = process.env.PORT || 4080;
app.listen(port, () => {
    console.log(`Authentication Server Listening on port: ${port}`);
});
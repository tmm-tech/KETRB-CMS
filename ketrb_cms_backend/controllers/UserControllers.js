const { query } = require('../config/sqlConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateCreateUserSchema = require('../services/RegistrationValidation');
const reportService = require('../services/SendEmailService');
const { createToken } = require('../services/jwtServices');

module.exports = {
    // Create a new user
    createUser: async (req, res) => {
        const details = req.body;
        try {
            let value = await validateCreateUserSchema(details);
            let hashed_pwd = await bcrypt.hash(value.password, 8);

            const insertUserQuery = `
                INSERT INTO users (fullname, email, password, gender, roles, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const params = [
                value.fullname,
                value.email,
                hashed_pwd,
                value.gender,
                value.roles,
                'active',
            ];

            const result = await query(insertUserQuery, params);
            reportService.sendAccountCreation(value.email, value.password, value.fullname, value.roles);

            res.json({ success: true, message: 'Registration successful', userId: result.rows[0].id });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ success: false, message: `Error registering user: ${error.message}` });
        }
    },

    // User login and JWT token generation
    loginUser: async (req, res) => {
        const details = req.body;
        try {
            const findUserQuery = `
                SELECT * FROM users WHERE email = $1;
            `;
            const userResult = await query(findUserQuery, [details.email]);

            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];
                const match = await bcrypt.compare(details.password, user.password);

                if (match) {
                    // Create JWT Token
                    let token = await createToken({ email: user.email, id: user.id });

                    // Set token as a cookie (HttpOnly and valid for 1 hour)
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true, // Ensures cookie is sent only over HTTPS
                        sameSite: 'None', // Allows cross-site cookies
                        maxAge: 60 * 60 * 1000 // 1 hour
                    });
                    // Respond with user data
                    res.json({ success: true, data: user });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid Credentials' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
    },

    // Get all Users
    getAllUser: async (req, res) => {
        try {
            const getUserQuery = `
            SELECT * FROM users;
        `;
            const userResult = await query(getUserQuery); // Remove the [id] parameter

            if (userResult.rows.length > 0) {
                res.json({
                    success: true,
                    message: 'Users retrieved successfully',
                    data: userResult.rows // Send all user data, not just the first row
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No users found'
                });
            }
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                message: `Get User Details Error: ${error.message}`
            });
        }
    },
    
    getAUser: async (req, res) => {
        const { id } = req.params;
        try {
            const getUserQuery = `
                SELECT * FROM users WHERE id = $1;
            `;
            const userResult = await query(getUserQuery, [id]);


            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];
            user.password = decryptPassword(user.password); // Decrypt password
                res.json({ success: true, message: 'User retrieved successfully', data: user });


            } else {
                res.status(404).json({ success: false, message: 'User not found' });

            }
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ success: false, message: `Get User Details Error: ${error.message}` });

        }
    },

    // Update user details
    updateUser: async (req, res) => {
        const { fullname, password, email, role } = req.body;
        const { id } = req.params;
        try {
            let hashed_pwd = await bcrypt.hash(password, 8);

            const updateUserQuery = `
                UPDATE users
                SET fullname = $1, email = $2, password = $3, roles = $4
                WHERE id = $5;
            `;
            const params = [fullname, email, hashed_pwd, role, id];

            const result = await query(updateUserQuery, params);

            if (result.rows.length > 0) {
                res.json({ success: true, message: 'User updated successfully', data: result.rows[0] });
                reportService.sendAccountUpdate(value.email, value.password, value.fullname, value.roles);
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: `Error updating user: ${error.message}` });
        }
    },

    // Soft delete (deactivate) user
    SoftDeleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const deleteUserQuery = `
                UPDATE users SET isdeleted = $1 WHERE id = $2;
            `;
            const result = await query(deleteUserQuery, ['TRUE', id]);

            if (result.rowCount > 0) {
                res.json({ success: true, message: 'User deleted successfully' });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ success: false, message: `Remove User Error: ${error.message}` });
        }
    },
    // Example check for authentication in your routes (backend)
    checkAuth: (req, res, next) => {
        const token = req.cookies ? req.cookies.token : null;
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.SECRET);
                req.user = decodedToken; // Attach decoded token data to request if needed
                res.status(200).json({ authenticated: true });
            } catch (error) {
                console.error('Token verification failed:', error);
                res.status(401).json({ authenticated: false, message: 'Invalid token.' });
            }
        } else {
            res.status(401).json({ authenticated: false, message: 'No token provided.' });
        }
    },


    // User logout and token invalidation
    Logout: async (req, res) => {
        const { email } = req.params;
        try {
            const updateUserStatusQuery = `
                 SELECT * FROM users WHERE email = $1;
            `;
            const result = await query(updateUserStatusQuery, [email]);

            if (result.rowCount > 0) {
                // Clear the token cookie
                res.clearCookie('token');
                res.json({ success: true, message: 'User logged out successfully' });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ success: false, message: `Log Out Error: ${error.message}` });
        }
    },
};


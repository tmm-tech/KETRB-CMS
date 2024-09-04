const { query } = require('../config/sqlConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateCreateUserSchema = require('../services/RegistrationValidation');
const { createToken } = require('../services/jwtServices');

module.exports = {
    createUser: async (req, res) => {
        const details = req.body;
        try {
            
            let value = await validateCreateUserSchema(details);
            
            let hashed_pwd = await bcrypt.hash(value.password, 8);

            const insertUserQuery = `
                INSERT INTO users (fullname, email, password, gender, role, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const params = [
                value.fullname,
                value.email,
                hashed_pwd,
                value.gender,
                value.role,
                'active',
            ];

            const result = await query(insertUserQuery, params);

            res.json({ success: true, message: 'Registration successful', userId: result.rows[0].id });

        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ success: false, message: `Error registering user: ${error.message}` });
        }
    },

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
                    let token = await createToken({ email: user.email, id: user.id });
                    const updateUserStatusQuery = `
                        UPDATE users SET status = $1 WHERE id = $2;
                    `;
                    await query(updateUserStatusQuery, ['active', user.id]);
                    res.json({ success: true, bearer: token, data: user });
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

    getAUser: async (req, res) => {
        const { id } = req.params;
        try {
            const getUserQuery = `
                SELECT * FROM users WHERE id = $1;
            `;
            const userResult = await query(getUserQuery, [id]);

            if (userResult.rows.length > 0) {
                res.json({ success: true, message: 'User retrieved successfully', data: userResult.rows[0] });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ success: false, message: `Get User Details Error: ${error.message}` });
        }
    },

    updateUser: async (req, res) => {
        const { fullname, password, email, roles } = req.body;
        const { id } = req.params;
        try {
            let hashed_pwd = await bcrypt.hash(password, 8);

            const updateUserQuery = `
                UPDATE users
                SET fullname = $1, email = $2, password = $4, roles = $6
                WHERE id = $7
                RETURNING *;
            `;
            const params = [fullname, email, profile, hashed_pwd, department, roles, id];

            const result = await query(updateUserQuery, params);

            if (result.rows.length > 0) {
                res.json({ success: true, message: 'User updated successfully', data: result.rows[0] });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: `Error updating user: ${error.message}` });
        }
    },

    SoftDeleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const deleteUserQuery = `
                UPDATE users SET status = $1 WHERE id = $2;
            `;
            const result = await query(deleteUserQuery, ['inactive', id]);

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

    Logout: async (req, res) => {
        const { email } = req.params;
        try {
            const updateUserStatusQuery = `
                UPDATE users SET status = $1 WHERE email = $2;
            `;
            const result = await query(updateUserStatusQuery, ['inactive', email]);

            if (result.rowCount > 0) {
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
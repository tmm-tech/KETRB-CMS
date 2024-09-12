const UserRoutes = require('express').Router();
const {
    createUser,
    getAllUser,
    updateUser,
    SoftDeleteUser,
    loginUser,
    getAUser,
    Logout,
    checkAuth,
} = require('../controllers/UserControllers');

// create and insert data into the table
UserRoutes.post('/register', createUser)
//read for all users
UserRoutes.get('/allusers', getAllUser)
//read for a specific id
UserRoutes.get('/user/:id', getAUser)
//soft delete item of a specific id
UserRoutes.delete('/user/:id', SoftDeleteUser)
//update items
UserRoutes.put('/update/:id', updateUser)
// login a user
UserRoutes.post('/login', loginUser)
// logout user
UserRoutes.post('/logout/:email', Logout)
//authenticate
UserRoutes.get('/protected', checkAuth, (req, res) => {
    // Handle the request if authenticated
    res.json({ message: 'Access granted to protected route.' });
});
module.exports = UserRoutes

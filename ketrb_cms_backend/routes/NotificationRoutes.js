const express = require('express');
const { getNotifications, updateNotificationStatus } = require('../controllers/notificationController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Get all notifications for the user
router.get('/', getNotifications);

// Update notification status (read/unread)
router.put('/:id/status', updateNotificationStatus);

module.exports = router;

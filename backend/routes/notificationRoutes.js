const express = require('express');
const notificationController = require('../controllers/notificationController');
const webhookHandler = require('../utils/webhookHandler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Facebook Webhook routes
router.get('/webhook', webhookHandler.verifyWebhook);
router.post('/webhook', webhookHandler.processWebhook);

// Protected notification routes
router.get('/', authenticateToken, notificationController.getUserNotifications);
router.put('/:notificationId/read', authenticateToken, notificationController.markAsRead);
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

// Check FB comments for new notifications
router.post('/check/:postId', authenticateToken, notificationController.checkFacebookComments);

module.exports = router;
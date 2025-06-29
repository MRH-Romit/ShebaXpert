const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticateToken, isServiceProvider } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/:userId', profileController.getProfile);
router.get('/nearby', profileController.findNearbyProviders);

// Protected routes
router.get('/', authenticateToken, profileController.getProfile); // Get own profile
router.get('/service-provider', authenticateToken, profileController.getServiceProviderProfile); // Get service provider profile
router.post('/update', authenticateToken, profileController.updateProfile);

module.exports = router;
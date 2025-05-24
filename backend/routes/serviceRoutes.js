const express = require('express');
const serviceController = require('../controllers/serviceController');
const { authenticateToken, isServiceProvider, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/categories', serviceController.getCategories);
router.get('/providers/:category', serviceController.getProvidersByCategory);

// Protected routes
router.post('/summary/:providerId', authenticateToken, serviceController.generateSummary);
router.post('/fbpost/:providerId', authenticateToken, isServiceProvider, serviceController.postToFacebook);
router.get('/pdf/:providerId', authenticateToken, serviceController.generatePDF);

module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Dashboard statistics
router.get('/dashboard/stats', authenticateToken, isAdmin, adminController.getDashboardStats);

// User management
router.get('/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.put('/users/:userId/status', authenticateToken, isAdmin, adminController.updateUserStatus);

// Service provider management
router.get('/service-providers', authenticateToken, isAdmin, adminController.getServiceProviders);
router.put('/service-providers/:providerId/verify', authenticateToken, isAdmin, adminController.verifyServiceProvider);

// Database information
router.get('/database/info', authenticateToken, isAdmin, adminController.getDatabaseInfo);

module.exports = router;

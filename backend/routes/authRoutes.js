const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/register-service-provider', authController.registerServiceProvider);
router.post('/upload-service-provider-files', authController.uploadServiceProviderFiles);

module.exports = router;

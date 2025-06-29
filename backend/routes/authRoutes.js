const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/register-service-provider', authController.registerServiceProvider);
router.post('/upload-service-provider-files', authController.uploadServiceProviderFiles);

// Registration checker routes
// router.get('/check-registrations', authController.checkRegistrations);
router.get('/latest-registration', authController.getLatestRegistration);
// router.get('/all-registrations', authController.getAllRegistrations);

module.exports = router;

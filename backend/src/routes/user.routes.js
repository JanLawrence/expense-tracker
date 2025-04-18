const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  validateProfileUpdate, 
  validatePasswordChange, 
  validateEmailChange,
  validateIdParam
} = require('../middleware/validation.middleware');

// Apply authentication middleware to all user routes
router.use(authenticate);

// Get current user profile
router.get('/profile', userController.getCurrentUser);

// Update user profile
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// Update starting money
router.put('/starting-money', userController.updateStartingMoney);

// Change password
router.post('/change-password', validatePasswordChange, userController.changePassword);

// Change email
router.post('/change-email', validateEmailChange, userController.changeEmail);

// Delete account
router.delete('/account', userController.deleteAccount);

module.exports = router;
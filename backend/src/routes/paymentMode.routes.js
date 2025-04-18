const express = require('express');
const router = express.Router();
const paymentModeController = require('../controllers/paymentMode.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validatePaymentMode, validateIdParam } = require('../middleware/validation.middleware');

// Apply authentication to all payment mode routes
router.use(authenticate);

// Get all payment modes for the authenticated user
router.get('/', paymentModeController.getAllPaymentModes);

// Get payment mode by ID
router.get('/:id', validateIdParam, paymentModeController.getPaymentModeById);

// Create new payment mode
router.post('/', validatePaymentMode, paymentModeController.createPaymentMode);

// Update payment mode
router.put('/:id', validateIdParam, validatePaymentMode, paymentModeController.updatePaymentMode);

// Delete payment mode
router.delete('/:id', validateIdParam, paymentModeController.deletePaymentMode);

module.exports = router;
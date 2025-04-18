const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const expenseRoutes = require('./expense.routes');
const categoryRoutes = require('./category.routes');
const paymentModeRoutes = require('./paymentMode.routes');

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/payment-modes', paymentModeRoutes);

module.exports = router;
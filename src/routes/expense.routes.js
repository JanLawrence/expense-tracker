const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateExpense } = require('../middleware/validation.middleware.js');

// Apply authentication to all expense routes
router.use(authenticate);

// Get all expenses for current user
router.get('/', expenseController.getAllExpenses);

// Get expense by ID
router.get('/:id', expenseController.getExpenseById);

// Create new expense
router.post('/', validateExpense, expenseController.createExpense);

// Update expense
router.put('/:id', validateExpense, expenseController.updateExpense);

// Delete expense (soft delete)
router.delete('/:id', expenseController.deleteExpense);

// Get expenses by category
router.get('/by-category/:categoryId', expenseController.getExpensesByCategory);

// Get expenses by payment mode
router.get('/by-payment-mode/:paymentModeId', expenseController.getExpensesByPaymentMode);

// Get monthly expense summary
router.get('/summary/monthly', expenseController.getMonthlySummary);

// Get daily expense summary
router.get('/summary/daily', expenseController.getDailySummary);

module.exports = router;
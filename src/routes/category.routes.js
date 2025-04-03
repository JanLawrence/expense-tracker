const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateCategory, validateIdParam } = require('../middleware/validation.middleware');

// Apply authentication to all category routes
router.use(authenticate);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', validateIdParam, categoryController.getCategoryById);

// Create new category
router.post('/', validateCategory, categoryController.createCategory);

// Update category
router.put('/:id', validateIdParam, validateCategory, categoryController.updateCategory);

// Delete category
router.delete('/:id', validateIdParam, categoryController.deleteCategory);

module.exports = router;
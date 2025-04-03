
const { body, param, validationResult } = require('express-validator');

// Utility function to validate results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim(),
  body('middleName')
    .optional()
    .trim(),
  body('contactNo')
    .notEmpty()
    .withMessage('Contact number is required'),
  validate
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Expense validation
exports.validateExpense = [
  body('categoryId')
    .isInt()
    .withMessage('Category ID must be an integer')
    .toInt(),
  body('paymentModeId')
    .isInt()
    .withMessage('Payment Mode ID must be an integer')
    .toInt(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number')
    .toFloat(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be valid ISO format'),
  body('isShared')
    .optional()
    .isBoolean()
    .withMessage('isShared must be a boolean value')
    .toBoolean(),
  body('shareAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Share amount must be a positive number')
    .toFloat(),
  body('isPaidShared')
    .optional()
    .isBoolean()
    .withMessage('isPaidShared must be a boolean value')
    .toBoolean(),
  body('showOnReport')
    .optional()
    .isBoolean()
    .withMessage('showOnReport must be a boolean value')
    .toBoolean(),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean value')
    .toBoolean(),
  body('recurringStartDate')
    .optional()
    .isISO8601()
    .withMessage('Recurring start date must be valid ISO format'),
  body('recurringEndDate')
    .optional()
    .isISO8601()
    .withMessage('Recurring end date must be valid ISO format'),
  body('recurringFrequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurring frequency must be daily, weekly, monthly, or yearly'),
  validate
];

// Category validation
exports.validateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  validate
];

// Payment Mode validation
exports.validatePaymentMode = [
  body('type')
    .notEmpty()
    .withMessage('Payment mode type is required')
    .isIn(['CASH', 'BANK', 'CREDIT'])
    .withMessage('Type must be CASH, BANK, or CREDIT'),
  body('name')
    .notEmpty()
    .withMessage('Payment mode name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Payment mode name must be between 2 and 50 characters'),
  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Credit limit must be a positive number')
    .toFloat(),
  body('cutoffDate')
    .optional()
    .isISO8601()
    .withMessage('Cutoff date must be valid ISO format'),
  body('network')
    .optional()
    .trim(),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Color must be a valid hex color code'),
  validate
];

// User profile update validation
exports.validateProfileUpdate = [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .trim(),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .trim(),
  body('middleName')
    .optional()
    .trim(),
  body('contactNo')
    .optional()
    .notEmpty()
    .withMessage('Contact number cannot be empty'),
  body('income')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Income must be a positive number')
    .toFloat(),
  validate
];

// Password change validation
exports.validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
    .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error('New password must be different from current password');
        }
        return true;
    })
    .withMessage('New password must be different from current password'),
  validate
];

// Email change validation
exports.validateEmailChange = [
  body('newEmail')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required for verification'),
  validate
];

// ID parameter validation
exports.validateIdParam = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer')
    .toInt(),
  validate
];
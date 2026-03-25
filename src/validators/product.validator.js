const { body, param } = require('express-validator');

exports.createProductValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .trim(),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be 0 or more'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];

exports.updateProductValidator = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be 0 or more'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
];
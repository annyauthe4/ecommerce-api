const { body, param } = require('express-validator');

exports.addToCartValidator = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

exports.updateCartValidator = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

exports.removeCartItemValidator = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID')
];
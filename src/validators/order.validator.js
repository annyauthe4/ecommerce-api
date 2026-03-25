const { param } = require('express-validator');

exports.cancelOrderValidator = [
  param('orderId')
    .isMongoId()
    .withMessage('Invalid order ID')
];
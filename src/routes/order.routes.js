const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { cancelOrderValidator } = require('../validators/order.validator');
const { handleValidationErrors } = require('../middlewares/validate.middleware');

router.post('/', protect, orderController.placeOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.patch(
  '/:orderId/cancel',
  protect,
  cancelOrderValidator,
  handleValidationErrors,
  orderController.cancelOrder
);

module.exports = router;

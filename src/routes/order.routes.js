const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { cancelOrderValidator } = require('../validators/order.validator');
const { handleValidationErrors } = require('../middlewares/validate.middleware');

router.post('/', protect, orderController.placeOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/admin/all', protect, adminOnly, orderController.getAllOrders);
router.get('/:orderId', protect, orderController.getOrder);
router.patch(
  '/:orderId/cancel',
  protect,
  cancelOrderValidator,
  handleValidationErrors,
  orderController.cancelOrder
);

module.exports = router;

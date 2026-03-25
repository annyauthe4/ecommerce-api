const router = require('express').Router();
const controller = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  addToCartValidator,
  updateCartValidator,
  removeCartItemValidator
} = require('../validators/cart.validator');
const {
  handleValidationErrors
} = require('../middlewares/validate.middleware');

router.get('/', protect, controller.getCart);
router.post(
  '/',
  protect,
  addToCartValidator,
  handleValidationErrors,
  controller.addItem
);
router.put(
  '/:productId',
  protect,
  updateCartValidator,
  handleValidationErrors,
  controller.updateItem
);
router.delete(
  '/:productId',
  protect,
  removeCartItemValidator,
  handleValidationErrors,
  controller.removeItem
);
router.delete('/', protect, controller.clearCart);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, controller.getCart);
router.post('/', protect, controller.addItem);
router.put('/:productId', protect, controller.updateItem);
router.delete('/:productId', protect, controller.removeItem);
router.delete('/', protect, controller.clearCart);

module.exports = router;

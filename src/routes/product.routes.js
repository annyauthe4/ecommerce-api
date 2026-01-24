const router = require('express').Router();
const controller = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/', protect, adminOnly, controller.createProduct);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);

module.exports = router;

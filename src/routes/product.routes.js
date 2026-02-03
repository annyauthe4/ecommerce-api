const router = require('express').Router();
const upload = require('../middlewares/upload.middleware');
const controller = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/', protect, adminOnly, upload.single('image'), controller.createProduct);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);

router.put('/:id', protect, adminOnly, upload.single('image'), controller.updateProduct);
router.delete('/:id', adminOnly, controller.deleteProduct);

module.exports = router;

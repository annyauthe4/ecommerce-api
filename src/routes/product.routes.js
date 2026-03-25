const router = require('express').Router();

const upload = require('../middlewares/upload.middleware');
const controller = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const {
  createProductValidator,
  updateProductValidator
} = require('../validators/product.validator');
const {
  handleValidationErrors
} = require('../middlewares/validate.middleware');

router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),
  createProductValidator,
  handleValidationErrors,
  controller.createProduct
);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.array('images', 5),
  updateProductValidator,
  handleValidationErrors,
  controller.updateProduct
);
router.delete('/:id', protect, adminOnly, controller.deleteProduct);


module.exports = router;

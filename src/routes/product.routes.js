const router = require('express').Router();
const controller = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth.admin, controller.createProduct);
router.get('/', controller.getProducts);

module.exports = router;

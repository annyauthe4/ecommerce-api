const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const {
  registerValidator,
  loginValidator
} = require('../validators/auth.validator');
const {
  handleValidationErrors
} = require('../middlewares/validate.middleware');

router.post('/register', registerValidator, handleValidationErrors, controller.register);
router.post('/login', loginValidator, handleValidationErrors, controller.login);

module.exports = router;

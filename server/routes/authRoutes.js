const express = require("express");
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validation/authValidation');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;

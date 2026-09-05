const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const { requireAuth } = require('../middlewares/authMiddleware');

// Public auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// Protected auth routes
router.get('/me', requireAuth, authController.getMe);

module.exports = router;

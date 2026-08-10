const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginRules, registerRules } = require('../validators');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;

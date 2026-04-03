const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Đường dẫn lấy profile cần được bảo vệ bằng middleware 'protect'
router.get('/profile', protect, authController.getUserProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // ĐÃ MỞ KHÓA

// Gắn chữ protect vào trước các hàm để bắt buộc phải có Token
router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.put('/update', protect, cartController.updateCart);
router.delete('/remove/:variantId', protect, cartController.removeFromCart);

module.exports = router;
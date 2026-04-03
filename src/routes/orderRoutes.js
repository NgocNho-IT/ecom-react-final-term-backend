const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // ĐÃ MỞ KHÓA

router.post('/checkout', protect, orderController.processCheckout);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderDetail);

module.exports = router;
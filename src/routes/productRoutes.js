const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/home', productController.getHomeData);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/:id', productController.getProductDetail);

// Review Management
router.post('/:id/reviews', protect, productController.addReview);
router.put('/reviews/:id', protect, productController.updateReview);
router.delete('/reviews/:id', protect, productController.deleteUserReview);
router.post('/reviews/:reviewId/reply', protect, admin, productController.addReply);

module.exports = router;
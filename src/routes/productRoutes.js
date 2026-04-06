const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search', productController.searchProducts);
router.get('/home', productController.getHomeData);
router.get('/categories', productController.getCategories);
router.get('/category/:id', productController.getProductsByCategory);
router.post('/:id/reviews', protect, productController.addReview);
router.post('/reviews/:reviewId/reply', protect, admin, productController.addReply);

router.get('/home', productController.getHomeData);

router.get('/search', productController.searchProducts);

router.get('/category/:foo', productController.getProductsByCategory);

router.get('/:id', productController.getProductDetail);

router.post('/reviews', productController.addReview);

module.exports = router;
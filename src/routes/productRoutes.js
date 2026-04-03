const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Khai báo các đường dẫn API (thường sẽ thêm tiền tố /api/products ở file server.js)
router.get('/search', productController.searchProducts);
router.get('/home', productController.getHomeData);
router.get('/categories', productController.getCategories);
router.get('/category/:id', productController.getProductsByCategory);
router.post('/:id/reviews', protect, productController.addReview);
router.post('/reviews/:reviewId/reply', protect, admin, productController.addReply);
// Tương đương: path('', views.home, name='home')
router.get('/home', productController.getHomeData);

// Tương đương: path('search/', views.search, name='search')
router.get('/search', productController.searchProducts);

// Tương đương: path('category/<str:foo>/', views.category, name='category')
router.get('/category/:foo', productController.getProductsByCategory);

// Tương đương: path('product/<int:pk>/', views.product_detail, name='product')
router.get('/:id', productController.getProductDetail);

// Tương đương: path('ajax/add-review/', views.add_review, name='add_review')
router.post('/reviews', productController.addReview);

module.exports = router;
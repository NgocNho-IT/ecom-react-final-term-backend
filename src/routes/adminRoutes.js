const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- CẤU HÌNH LƯU TRỮ FILE VỚI MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ảnh sẽ được lưu vào thư mục e-commerce/backend/public/uploads
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        // Đặt tên file theo kiểu: 17123456789-ten-anh-goc.jpg để tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra định dạng file (Chỉ cho phép upload ảnh)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ được phép upload file hình ảnh!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn file 5MB
});

// --- DANH SÁCH ROUTES ---

// Dashboard & Danh mục
router.get('/dashboard', protect, admin, adminController.getDashboardData);
router.delete('/category/:id', protect, admin, adminController.deleteCategory);
router.put('/category/:id', protect, admin, adminController.updateCategory);

// Quản lý Đơn hàng (Dùng isShipped như trong Order.js)
router.put('/order/:id/ship', protect, admin, adminController.shipOrder);
router.delete('/order/:id', protect, admin, adminController.deleteOrder);

// Quản lý Sản phẩm (Tích hợp upload.single('image') để nhận file ảnh)
// Lưu ý: Field name trong Form data gửi từ React phải là 'image'
router.post('/product', protect, admin, upload.single('image'), adminController.updateProduct); 
router.put('/product/:id', protect, admin, upload.single('image'), adminController.updateProduct);
router.delete('/product/:id', protect, admin, adminController.deleteProduct);

module.exports = router;
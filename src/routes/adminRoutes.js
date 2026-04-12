const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const createSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+|-+$/g, '');       
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const originalName = path.basename(file.originalname, ext);
        const cleanName = createSlug(originalName);
        const newFilename = `${cleanName}-${Date.now()}${ext}`;
        cb(null, newFilename);
    }
});

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
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// ================= CÁC ROUTES DÀNH CHO ADMIN =================

router.get('/dashboard', protect, admin, adminController.getDashboardData);
router.get('/export-excel', protect, admin, adminController.exportRevenueExcel);

router.delete('/category/:id', protect, admin, adminController.deleteCategory);
router.put('/category/:id', protect, admin, adminController.updateCategory);

router.get('/order/:id', protect, admin, adminController.getOrderById); 
router.put('/order/:id', protect, admin, adminController.updateOrder);  
router.put('/order/:id/ship', protect, admin, adminController.shipOrder);
router.delete('/order/:id', protect, admin, adminController.deleteOrder);

router.post('/product', protect, admin, upload.single('image'), adminController.updateProduct); 
router.put('/product/:id', protect, admin, upload.single('image'), adminController.updateProduct);
router.delete('/product/:id', protect, admin, adminController.deleteProduct);

router.delete('/review/:id', protect, admin, adminController.deleteReview);
router.get('/reviews', protect, admin, adminController.getAllReviewsAdmin);

// 6. QUẢN LÝ NGƯỜI DÙNG
router.get('/user/:id', protect, admin, adminController.getUserById); // <-- THÊM DÒNG NÀY
router.delete('/user/:id', protect, admin, adminController.deleteUser);
router.put('/user/:id/role', protect, admin, adminController.updateUserRole);
router.put('/user/:id/block', protect, admin, adminController.toggleUserBlock);
router.put('/user/:id', protect, admin, adminController.updateUserAdmin);

module.exports = router;
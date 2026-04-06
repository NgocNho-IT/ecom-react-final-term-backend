const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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




router.get('/dashboard', protect, admin, adminController.getDashboardData);

router.get('/export-excel', protect, admin, adminController.exportRevenueExcel);

router.delete('/category/:id', protect, admin, adminController.deleteCategory);
router.put('/category/:id', protect, admin, adminController.updateCategory);

router.put('/order/:id/ship', protect, admin, adminController.shipOrder);
router.delete('/order/:id', protect, admin, adminController.deleteOrder);

router.post('/product', protect, admin, upload.single('image'), adminController.updateProduct); 
router.put('/product/:id', protect, admin, upload.single('image'), adminController.updateProduct);
router.delete('/product/:id', protect, admin, adminController.deleteProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// ==============================================================
// TÍNH NĂNG: Hàm chuyển đổi tên file chuẩn SEO (Xóa dấu, khoảng trắng)
// ==============================================================
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
        .replace(/\s+/g, '-')           // Thay khoảng trắng bằng gạch nối
        .replace(/[^\w\-]+/g, '')       // Xóa các ký tự đặc biệt
        .replace(/\-\-+/g, '-')         // Tránh 2 gạch nối liên tiếp
        .replace(/^-+|-+$/g, '');       // Cắt gạch nối ở đầu và cuối
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        // 1. Lấy đuôi file gốc (VD: .jpg)
        const ext = path.extname(file.originalname);
        
        // 2. Lấy tên gốc bỏ phần đuôi
        const originalName = path.basename(file.originalname, ext);
        
        // 3. Ép tên gốc qua hàm xử lý tiếng Việt
        const cleanName = createSlug(originalName);
        
        // 4. Ghép nối: Tên siêu sạch + Thời gian + Đuôi file
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

// 1. Quản lý Dashboard và Thống kê
router.get('/dashboard', protect, admin, adminController.getDashboardData);
router.get('/export-excel', protect, admin, adminController.exportRevenueExcel);

// 2. Quản lý Danh mục (Categories)
router.delete('/category/:id', protect, admin, adminController.deleteCategory);
router.put('/category/:id', protect, admin, adminController.updateCategory);

// 3. Quản lý Đơn hàng (Orders)
router.put('/order/:id/ship', protect, admin, adminController.shipOrder);
router.delete('/order/:id', protect, admin, adminController.deleteOrder);

// 4. Quản lý Sản phẩm (Products)
router.post('/product', protect, admin, upload.single('image'), adminController.updateProduct); 
router.put('/product/:id', protect, admin, upload.single('image'), adminController.updateProduct);
router.delete('/product/:id', protect, admin, adminController.deleteProduct);

// 5. Quản lý Đánh giá (Reviews) - MỚI BỔ SUNG
// Route này cho phép Admin xóa vĩnh viễn các đánh giá rác từ khách hàng
router.delete('/review/:id', protect, admin, adminController.deleteReview);
// Thêm vào cùng nhóm với các route admin khác
router.get('/reviews', protect, admin, adminController.getAllReviewsAdmin);
module.exports = router;
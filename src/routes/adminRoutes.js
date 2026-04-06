const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// ==============================================================
// TÍNH NĂNG MỚI: Hàm chuyển đổi tên file chuẩn SEO (Xóa dấu, khoảng trắng)
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
        .replace(/[^\w\-]+/g, '')       // Xóa các ký tự đặc biệt (chỉ giữ lại chữ, số và gạch nối)
        .replace(/\-\-+/g, '-')         // Tránh trường hợp có 2 gạch nối liên tiếp
        .replace(/^-+|-+$/g, '');       // Cắt gạch nối ở đầu và cuối chuỗi nếu có
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        // 1. Lấy đuôi file gốc (VD: .jpg, .png, .webp)
        const ext = path.extname(file.originalname);
        
        // 2. Lấy tên gốc của file nhưng bỏ đi phần đuôi (VD: "Điện thoại iPhone 15 Pro Max")
        const originalName = path.basename(file.originalname, ext);
        
        // 3. Ép tên gốc qua hàm xử lý tiếng Việt (Kết quả: "dien-thoai-iphone-15-pro-max")
        const cleanName = createSlug(originalName);
        
        // 4. Ghép nối: Tên siêu sạch + Thời gian up + Đuôi file
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

router.put('/order/:id/ship', protect, admin, adminController.shipOrder);
router.delete('/order/:id', protect, admin, adminController.deleteOrder);

// Chú ý: Đảm bảo middleware upload.single('image') đã được cấu hình với storage mới
router.post('/product', protect, admin, upload.single('image'), adminController.updateProduct); 
router.put('/product/:id', protect, admin, upload.single('image'), adminController.updateProduct);
router.delete('/product/:id', protect, admin, adminController.deleteProduct);

module.exports = router;
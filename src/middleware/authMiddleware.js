const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem có token gửi lên trong Headers không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token (Bỏ chữ 'Bearer ' ở đầu)
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token để lấy ID của user
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user trong DB và gán vào request (bỏ qua mật khẩu)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp vào Controller
        } catch (error) {
            console.error(error);
            // Phải dùng return để dừng code chạy tiếp xuống dưới
            return res.status(401).json({ success: false, message: 'Không có quyền truy cập, Token không hợp lệ!' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập, không tìm thấy Token!' });
    }
};

// THÊM: Hàm kiểm tra quyền Admin
const admin = (req, res, next) => {
    // req.user đã được hàm protect gán ở trước đó
    if (req.user && req.user.isAdmin) {
        next(); // Nếu là admin thì cho phép đi tiếp
    } else {
        res.status(401).json({ success: false, message: 'Từ chối truy cập. Tính năng này chỉ dành cho Admin!' });
    }
};

// Xuất CẢ 2 hàm ra ngoài để các file khác có thể gọi
module.exports = { protect, admin };
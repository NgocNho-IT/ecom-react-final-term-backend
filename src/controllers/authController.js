const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token có hạn trong 30 ngày
    });
};

// 1. Xử lý Đăng ký (Tương đương view 'register_user')

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;

        // 1. Backend Validation
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải chứa ít nhất 8 ký tự.' });
        }
        if (/^\d+$/.test(password)) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không được chỉ chứa toàn chữ số.' });
        }
        if (!/^\d{9,11}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
        }

        // 2. Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
        }

        // 3. Băm mật khẩu (Mã hóa)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo User mới
        const user = await User.create({
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword
        });

        // 5. Trả về Token
        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Xử lý Đăng nhập (Tương đương view 'login_user')
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm User theo email
        const user = await User.findOne({ email });

        // So sánh mật khẩu nhập vào với mật khẩu đã băm trong DB
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Lấy thông tin Hồ sơ cá nhân (Tương đương view 'update_user')
exports.getUserProfile = async (req, res) => {
    try {
        // req.user được gán từ Middleware bảo vệ (ở bước 3)
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// 1. ĐĂNG KÝ TÀI KHOẢN (Đã đồng bộ dùng phone)
// ==========================================
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;

        // Backend Validation: Chặn đứng hacker bypass Frontend
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải chứa ít nhất 8 ký tự.' });
        }
        if (/^\d+$/.test(password)) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không được chỉ chứa toàn chữ số.' });
        }
        if (!/^\d{9,11}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                permissions: user.permissions, // <-- BỔ SUNG TRẢ VỀ QUYỀN
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. ĐĂNG NHẬP
// ==========================================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                permissions: user.permissions, // <-- BỔ SUNG TRẢ VỀ QUYỀN
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. LẤY THÔNG TIN HỒ SƠ (PROFILE)
// ==========================================
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. CẬP NHẬT THÔNG TIN HỒ SƠ (MỚI)
// ==========================================
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phone: updatedUser.phone,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                isSuperAdmin: updatedUser.isSuperAdmin,
                permissions: updatedUser.permissions, // <-- BỔ SUNG TRẢ VỀ QUYỀN
                token: generateToken(updatedUser._id) // Cấp lại token cho User sau khi update
            });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 5. ĐỔI MẬT KHẨU (NÂNG CẤP UX)
// ==========================================
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Bước 1: So sánh mật khẩu cũ người dùng nhập với mật khẩu trong Database
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            
            if (!isMatch) {
                // UX CHUẨN: Báo lỗi chính xác nếu sai mật khẩu cũ
                return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác!' });
            }

            // Bước 2: Validate mật khẩu mới ở Backend để bảo mật kép
            if (newPassword.length < 8) {
                return res.status(400).json({ success: false, message: 'Mật khẩu mới phải chứa ít nhất 8 ký tự.' });
            }
            if (/^\d+$/.test(newPassword)) {
                return res.status(400).json({ success: false, message: 'Mật khẩu mới không được chỉ chứa toàn chữ số.' });
            }

            // Bước 3: Mã hóa và Lưu mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đổi mật khẩu!' });
    }
};
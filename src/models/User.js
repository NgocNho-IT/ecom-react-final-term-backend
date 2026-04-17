const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    phone: { type: String, required: true, maxlength: 15 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    // MỚI: Mảng lưu trữ các quyền truy cập Module
    permissions: { type: [String], default: [] } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
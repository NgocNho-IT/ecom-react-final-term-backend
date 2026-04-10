const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    content: { type: String, required: true },
    
    // ĐÃ SỬA: Đảm bảo dữ liệu chuẩn 1-5 sao
    rating: { type: Number, default: 5, min: 1, max: 5 },
    
    isParent: { type: Boolean, default: true },
    parentReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
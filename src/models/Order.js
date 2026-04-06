const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của cấu hình khách chọn
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Bỏ trống nếu khách mua không cần đăng nhập
    
    shippingInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        zipcode: { type: String }
    },
    
    orderItems: [orderItemSchema],
    
    amountPaid: { type: Number, required: true, default: 0 },

    // CÁC TRƯỜNG MỚI ĐƯỢC THÊM VÀO CHO TÍNH NĂNG QR
    paymentMethod: { type: String, enum: ['COD', 'QR'], default: 'COD' },
    isPaid: { type: Boolean, default: false },
    note: { type: String, default: '' }, // Ghi chú đơn hàng

    isShipped: { type: Boolean, default: false },
    shippedAt: { type: Date }
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
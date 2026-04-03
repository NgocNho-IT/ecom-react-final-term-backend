const mongoose = require('mongoose');

// Schema phụ cho sản phẩm trong giỏ (OrderItem)
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của cấu hình khách chọn
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Bỏ trống nếu khách mua không cần đăng nhập
    
    // Thông tin giao hàng
    shippingInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        zipcode: { type: String }
    },
    
    // Danh sách sản phẩm mua
    orderItems: [orderItemSchema],
    
    amountPaid: { type: Number, required: true, default: 0 },
    
    // Trạng thái đơn
    isShipped: { type: Boolean, default: false },
    shippedAt: { type: Date }
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
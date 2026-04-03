const mongoose = require('mongoose');

// Schema phụ cho Cấu hình (Không tạo collection riêng)
const variantSchema = new mongoose.Schema({
    colorName: { type: String, required: true },       // VD: Titan Xanh
    colorHex: { type: String, default: '#000000' },    // VD: #4a5b6d
    storageCapacity: { type: String, required: true }, // VD: 256GB
    network: { type: String, enum: ['4G', '5G'], default: '4G' },
    price: { type: Number, default: 0 },
    isSale: { type: Boolean, default: false },
    salePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 150 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true }, // Lưu đường dẫn URL hoặc tên file
    
    // Thông số kỹ thuật
    specs: {
        screen: { type: String },
        os: { type: String },
        cameraBack: { type: String },
        cameraFront: { type: String },
        cpu: { type: String },
        battery: { type: String }
    },
    
    youtubeId: { type: String }, // Đã cắt regex lấy ID ở controller
    
    // Mảng chứa các phiên bản (Màu sắc, dung lượng)
    variants: [variantSchema]

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
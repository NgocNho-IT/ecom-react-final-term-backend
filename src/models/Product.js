const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    colorName: { type: String, required: true }, 
    colorHex: { type: String, default: '#000000' },
    storageCapacity: { type: String, required: true }, 
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
    image: { type: String, required: true },
    
    // ĐÃ THÊM: Lưu trữ điểm trung bình và số lượng đánh giá
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    specs: {
        screen: { type: String },
        os: { type: String },
        cameraBack: { type: String },
        cameraFront: { type: String },
        cpu: { type: String },
        battery: { type: String }
    },
    youtubeId: { type: String },
    variants: [variantSchema]

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
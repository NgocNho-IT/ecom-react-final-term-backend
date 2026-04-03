const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    
    // Ánh xạ logic ForeignKey('self') của Django
    isParent: { type: Boolean, default: true },
    parentReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
    
    // Mảng này giúp Node.js lấy các câu trả lời nhanh hơn (tương đương related_name='replies')
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    
    isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Tương đương created_at = models.DateTimeField(auto_now_add=True)

module.exports = mongoose.model('Review', reviewSchema);
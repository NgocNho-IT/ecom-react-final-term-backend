const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// 1. LẤY DỮ LIỆU TRANG CHỦ (Sale + Tất cả sản phẩm)
exports.getHomeData = async (req, res) => {
    try {
        const saleProducts = await Product.find({ "variants.isSale": true })
            .limit(5)
            .populate('category', 'name');

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate('category', 'name');

        const categories = await Category.find();

        res.status(200).json({ 
            success: true, 
            saleProducts, 
            products, 
            categories 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. CHI TIẾT SẢN PHẨM (Kèm sản phẩm liên quan và Đánh giá)
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Lấy sản phẩm cùng danh mục (liên quan)
        const relatedProducts = await Product.aggregate([
            { $match: { category: product.category._id, _id: { $ne: product._id } } },
            { $sample: { size: 4 } }
        ]);

        // Lấy đánh giá gốc và các phản hồi của Admin
        const reviews = await Review.find({ product: product._id, isParent: true, isActive: true })
            .populate('replies')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            product, 
            relatedProducts, 
            reviews 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. TÌM KIẾM SẢN PHẨM
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('category', 'name');

        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. LẤY TẤT CẢ DANH MỤC (Dùng cho Nav/Menu)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. LẤY SẢN PHẨM THEO DANH MỤC (ĐÃ FIX: Trả về categoryName cho React)
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Tìm thông tin danh mục trước để lấy cái Tên
        const category = await Category.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục này!' });
        }

        // Tìm các sản phẩm thuộc danh mục đó
        const products = await Product.find({ category: categoryId }).populate('category', 'name');

        res.status(200).json({ 
            success: true, 
            categoryName: category.name, // Đây là cái Nhớ cần để hiện lên Header nè!
            products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. KHÁCH HÀNG THÊM ĐÁNH GIÁ
exports.addReview = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const productId = req.params.id;

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: `${req.user.lastName} ${req.user.firstName}`, // Ghép tên chuẩn
            phone: req.user.phone || '',
            email: req.user.email || '',
            rating: Number(rating),
            content,
            isParent: true
        });

        res.status(201).json({ success: true, message: 'Đã gửi đánh giá!', review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. ADMIN PHẢN HỒI ĐÁNH GIÁ (Reply)
exports.addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const parentId = req.params.reviewId;
        const parentReview = await Review.findById(parentId);

        if (!parentReview) {
            return res.status(404).json({ success: false, message: "Không thấy bình luận gốc để trả lời" });
        }

        const reply = await Review.create({
            product: parentReview.product,
            user: req.user._id,
            name: req.user.isAdmin ? 'Admin NNIT Shop' : `${req.user.lastName} ${req.user.firstName}`,
            content,
            rating: 5, // Mặc định phản hồi Admin là 5 sao
            isParent: false,
            parentReview: parentId
        });

        // Đưa ID của phản hồi này vào mảng replies của bình luận gốc để hiển thị dạng lồng nhau
        parentReview.replies.push(reply._id);
        await parentReview.save();

        res.status(201).json({ success: true, message: 'Phản hồi thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
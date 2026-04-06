const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

exports.getHomeData = async (req, res) => {
    try {
        // --- LOGIC PHÂN TRANG (PAGINATION) CHO TRANG CHỦ ---
        const page = parseInt(req.query.page) || 1; 
        const limit = 12; 
        const skip = (page - 1) * limit; 

        // 1. Lấy sản phẩm đang giảm giá (luôn lấy 5 cái cho slide)
        const saleProducts = await Product.find({ "variants.isSale": true })
            .limit(5)
            .populate('category', 'name');

        // 2. Đếm tổng số lượng sản phẩm để chia trang
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit); 

        // 3. Lấy sản phẩm theo trang hiện tại (Có skip và limit)
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name');

        const categories = await Category.find();

        res.status(200).json({ 
            success: true, 
            saleProducts, 
            products, 
            categories,
            currentPage: page,  
            totalPages          
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        const relatedProducts = await Product.aggregate([
            { $match: { category: product.category._id, _id: { $ne: product._id } } },
            { $sample: { size: 4 } }
        ]);

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

// ==========================================
// API TÌM KIẾM CÓ PHÂN TRANG
// ==========================================
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';
        
        // Logic phân trang
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Tạo điều kiện tìm kiếm
        const searchCriteria = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Đếm tổng số để chia trang
        const totalProducts = await Product.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy dữ liệu theo trang
        const products = await Product.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .populate('category', 'name');

        res.status(200).json({ 
            success: true, 
            count: products.length, 
            products,
            currentPage: page,
            totalPages 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// API LẤY SẢN PHẨM THEO DANH MỤC CÓ PHÂN TRANG
// ==========================================
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Logic phân trang
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục này!' });
        }

        // Đếm tổng số SP trong danh mục để chia trang
        const totalProducts = await Product.countDocuments({ category: categoryId });
        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy dữ liệu theo trang
        const products = await Product.find({ category: categoryId })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name');

        res.status(200).json({ 
            success: true, 
            categoryName: category.name,
            products,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const productId = req.params.id;

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: `${req.user.lastName} ${req.user.firstName}`,
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
            rating: 5,
            isParent: false,
            parentReview: parentId
        });

        parentReview.replies.push(reply._id);
        await parentReview.save();

        res.status(201).json({ success: true, message: 'Phản hồi thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
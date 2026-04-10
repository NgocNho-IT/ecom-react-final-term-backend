const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// ==========================================
// HÀM BỔ TRỢ: TỰ ĐỘNG CẬP NHẬT RATING SẢN PHẨM
// ==========================================
// Hàm này giúp đồng bộ điểm trung bình và số lượng đánh giá vào Model Product
const updateProductRating = async (productId) => {
    // Tìm tất cả đánh giá gốc (isParent: true) và đang hoạt động của sản phẩm
    const allReviews = await Review.find({ 
        product: productId, 
        isParent: true, 
        isActive: true 
    });

    const numReviews = allReviews.length;
    // Tính điểm trung bình, nếu chưa có đánh giá thì trả về 0 (chuẩn dữ liệu)
    const avgRating = numReviews > 0 
        ? (allReviews.reduce((sum, item) => item.rating + sum, 0) / numReviews) 
        : 0;

    // Cập nhật lại cache rating vào Model Product để hiển thị nhanh ở các trang danh sách
    await Product.findByIdAndUpdate(productId, {
        rating: Number(avgRating.toFixed(1)), // Lưu 1 chữ số thập phân (VD: 4.8)
        numReviews: numReviews
    });
};

// ==========================================
// 1. LẤY DỮ LIỆU TRANG CHỦ (CÓ PHÂN TRANG)
// ==========================================
exports.getHomeData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = 12; 
        const skip = (page - 1) * limit; 

        // Lấy sản phẩm đang giảm giá cho slide Carousel
        const saleProducts = await Product.find({ "variants.isSale": true })
            .limit(5)
            .populate('category', 'name');

        const totalProducts = await Product.countDocuments();

        // Lấy danh sách sản phẩm theo trang, ưu tiên máy mới về
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
            totalPages: Math.ceil(totalProducts / limit),
            totalItems: totalProducts 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. LẤY CHI TIẾT SẢN PHẨM & BIỂU ĐỒ SAO
// ==========================================
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Lấy sản phẩm liên quan (ngẫu nhiên 4 cái cùng loại)
        const relatedProducts = await Product.aggregate([
            { $match: { category: product.category._id, _id: { $ne: product._id } } },
            { $sample: { size: 4 } }
        ]);

        // Lấy danh sách đánh giá kèm các câu trả lời của Admin
        const reviews = await Review.find({ product: product._id, isParent: true, isActive: true })
            .populate('replies')
            .sort({ createdAt: -1 });

        // Thuật toán: Tính toán số lượng cho từng cột sao (1-5) để vẽ biểu đồ Google Play
        let distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(rv => {
            if (distribution[rv.rating] !== undefined) {
                distribution[rv.rating]++;
            }
        });

        res.status(200).json({ 
            success: true, 
            product, 
            relatedProducts, 
            reviews,
            ratingStats: {
                average: product.rating || 0,
                total: product.numReviews || 0,
                distribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. TÌM KIẾM SẢN PHẨM (ĐÃ SỬA LỖI CHÍNH XÁC)
// ==========================================
exports.searchProducts = async (req, res) => {
    try {
        // Tối ưu: Loại bỏ khoảng trắng và xử lý từ khóa chuẩn xác
        const query = req.query.q ? req.query.q.trim() : ''; 
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        if (!query) {
            return res.status(200).json({ success: true, totalItems: 0, products: [], currentPage: 1, totalPages: 0 });
        }

        // CHỈ TÌM TRONG TÊN: Để tránh gõ "s" ra các máy có chữ "s" trong mô tả (description)
        const searchCriteria = {
            name: { $regex: query, $options: 'i' }
        };

        const totalProducts = await Product.countDocuments(searchCriteria);

        const products = await Product.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .populate('category', 'name');

        res.status(200).json({ 
            success: true, 
            totalItems: totalProducts,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. LẤY SẢN PHẨM THEO DANH MỤC
// ==========================================
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục!' });
        }

        const totalProducts = await Product.countDocuments({ category: categoryId });

        const products = await Product.find({ category: categoryId })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('category', 'name');

        res.status(200).json({ 
            success: true, 
            categoryName: category.name,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalItems: totalProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 5. THÊM ĐÁNH GIÁ MỚI
// ==========================================
exports.addReview = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const productId = req.params.id;

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: `${req.user.lastName} ${req.user.firstName}`,
            rating: Number(rating),
            content,
            isParent: true
        });

        // Cập nhật lại cache điểm trung bình cho sản phẩm
        await updateProductRating(productId);

        res.status(201).json({ success: true, message: 'Đã gửi đánh giá!', review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. CHỈNH SỬA ĐÁNH GIÁ (CỦA CHÍNH CHỦ)
// ==========================================
exports.updateReview = async (req, res) => {
    try {
        const { rating, content } = req.body;
        const review = await Review.findById(req.params.id);
        
        if (!review) return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
        
        // Kiểm tra quyền: Chỉ người viết hoặc Admin mới được sửa
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Nhớ không có quyền sửa đánh giá này" });
        }

        review.rating = Number(rating);
        review.content = content;
        await review.save();

        // Tính toán lại điểm sau khi thay đổi số sao
        await updateProductRating(review.product);

        res.status(200).json({ success: true, message: "Đã cập nhật đánh giá thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 7. NGƯỜI DÙNG TỰ XÓA ĐÁNH GIÁ
// ==========================================
exports.deleteUserReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: "Không thấy đánh giá" });

        // Quyền xóa bài
        if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa đánh giá này" });
        }

        const productId = review.product;
        await Review.findByIdAndDelete(req.params.id);
        
        // Tính toán lại điểm sản phẩm sau khi bài viết bị xóa
        await updateProductRating(productId);

        res.status(200).json({ success: true, message: "Đã xóa đánh giá thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 8. PHẢN HỒI ĐÁNH GIÁ (DÀNH CHO ADMIN)
// ==========================================
exports.addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const parentId = req.params.reviewId;
        const parentReview = await Review.findById(parentId);

        if (!parentReview) return res.status(404).json({ success: false, message: "Không thấy bình luận gốc" });

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

// ==========================================
// 9. LẤY DANH SÁCH DANH MỤC
// ==========================================
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
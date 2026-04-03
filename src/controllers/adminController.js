const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// 1. LẤY DỮ LIỆU DASHBOARD
exports.getDashboardData = async (req, res) => {
    try {
        const deliveredOrders = await Order.find({ isShipped: true });
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.amountPaid, 0);
        const totalOrders = await Order.countDocuments();
        const pendingCount = await Order.countDocuments({ isShipped: false });
        const shippedCount = deliveredOrders.length;
        const productsCount = await Product.countDocuments();

        const daysList = [];
        const revenuesList = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextD = new Date(d);
            nextD.setDate(nextD.getDate() + 1);
            const dailyOrders = await Order.find({ isShipped: true, createdAt: { $gte: d, $lt: nextD } });
            const dailyRev = dailyOrders.reduce((sum, ord) => sum + ord.amountPaid, 0);
            daysList.push(`${d.getDate()}/${d.getMonth() + 1}`);
            revenuesList.push(dailyRev);
        }

        const orders = await Order.find().sort({ createdAt: -1 }).limit(20);
        const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
        const categories = await Category.find();
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat._id });
            return { ...cat._doc, productCount: count };
        }));

        res.status(200).json({
            success: true, totalRevenue, totalOrders, pendingCount, shippedCount, totalProducts: productsCount,
            daysList, revenuesList, orders, products, categories: categoriesWithCount
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 2. XÁC NHẬN GIAO HÀNG
exports.shipOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Không thấy đơn!' });
        order.isShipped = true; 
        order.shippedAt = Date.now();
        await order.save();
        res.status(200).json({ success: true, message: `Đã xác nhận đơn hàng #${order._id}` });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 3. XÓA ĐƠN HÀNG
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa đơn hàng thành công!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 4. XÓA SẢN PHẨM (Có xóa kèm file ảnh vật lý)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product && product.image) {
            const imagePath = path.join(__dirname, '..', 'public', product.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm và ảnh thành công!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 5. CẬP NHẬT / THÊM SẢN PHẨM (Xử lý dọn rác ảnh cũ)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, youtubeId, screen, os, cameraBack, cameraFront, cpu, battery, price, stock } = req.body;

        // CHỐT 1: Chuyển đổi dữ liệu phẳng về đúng cấu trúc Schema
        let productData = {
            name,
            category,
            description,
            youtubeId,
            // Bắt buộc ép kiểu Number cho các trường số
            price: Number(price) || 0,
            stock: Number(stock) || 0,
            specs: {
                screen: screen || "",
                os: os || "",
                cameraBack: cameraBack || "",
                cameraFront: cameraFront || "",
                cpu: cpu || "",
                battery: battery || ""
            }
        };

        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (id && id !== "undefined") {
                const oldProduct = await Product.findById(id);
                if (oldProduct && oldProduct.image) {
                    const oldPath = path.join(__dirname, '..', 'public', oldProduct.image);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }
            productData.image = `uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(id, productData, { 
            returnDocument: 'after', 
            runValidators: true // Đảm bảo dữ liệu mới khớp Schema
        });

        res.status(200).json({ success: true, message: 'Lưu thành công!', product });
    } catch (error) {
        // QUAN TRỌNG: Log lỗi này ra Terminal để Nhớ biết vì sao nó fail
        console.error("LỖI LƯU SẢN PHẨM:", error.message);
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
    }
};

// 6. XÓA DANH MỤC
exports.deleteCategory = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) return res.status(400).json({ success: false, message: 'Danh mục đang có sản phẩm!' });
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa danh mục!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 7. CẬP NHẬT DANH MỤC
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công!', category });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
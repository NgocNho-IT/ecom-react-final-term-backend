const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // MỚI THÊM ĐỂ BĂM MẬT KHẨU
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review'); 
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const excelJS = require('exceljs');

// =========================================================================
// 1. LẤY DỮ LIỆU DASHBOARD (THÊM LỌC NGÀY CHO ĐÁNH GIÁ)
// =========================================================================
exports.getDashboardData = async (req, res) => {
    try {
        const { 
            orderPage = 1, orderSearch = '', orderStatus = 'all', orderDate = '',
            productPage = 1, productSearch = '', productCategory = 'all',
            categoryPage = 1, categorySearch = '',
            reviewPage = 1, reviewSearch = '', reviewCategory = 'all', reviewDate = '',
            userPage = 1, userSearch = '', userRole = 'all' // MỚI: Thêm params cho User
        } = req.query;

        const limit = 10; 

        // Khúc 1: Thống kê
        const deliveredOrdersForStats = await Order.find({ isShipped: true });
        const totalRevenue = deliveredOrdersForStats.reduce((sum, order) => sum + (order.amountPaid || 0), 0);
        const totalOrdersAll = await Order.countDocuments();
        const pendingCountAll = await Order.countDocuments({ isShipped: false });
        const shippedCountAll = deliveredOrdersForStats.length;
        const productsCountAll = await Product.countDocuments();
        const totalReviewsCountAll = await Review.countDocuments({ isParent: true });
        const totalUsersAll = await User.countDocuments(); // Thống kê tổng User

        const daysList = [];
        const revenuesList = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
            const nextD = new Date(d); nextD.setDate(nextD.getDate() + 1);
            const dailyOrders = await Order.find({ isShipped: true, createdAt: { $gte: d, $lt: nextD } });
            const dailyRev = dailyOrders.reduce((sum, ord) => sum + ord.amountPaid, 0);
            daysList.push(`${d.getDate()}/${d.getMonth() + 1}`);
            revenuesList.push(dailyRev);
        }

        // Khúc 2,3,4,5: Đơn hàng, Sản phẩm, Danh mục (Giữ nguyên logic cũ)
        let orderQuery = {};
        if (orderSearch) {
            if (mongoose.Types.ObjectId.isValid(orderSearch)) orderQuery._id = orderSearch;
            else orderQuery['shippingInfo.fullName'] = { $regex: orderSearch, $options: 'i' };
        }
        if (orderStatus === 'shipped') orderQuery.isShipped = true;
        else if (orderStatus === 'pending') orderQuery.isShipped = false;
        if (orderDate) {
            const startDate = new Date(orderDate);
            const endDate = new Date(orderDate); endDate.setDate(endDate.getDate() + 1);
            orderQuery.createdAt = { $gte: startDate, $lt: endDate };
        }
        const totalOrdersCount = await Order.countDocuments(orderQuery);
        const orders = await Order.find(orderQuery).sort({ createdAt: -1 }).skip((Number(orderPage) - 1) * limit).limit(limit);

        let productQuery = {};
        if (productSearch) productQuery.name = { $regex: productSearch, $options: 'i' };
        if (productCategory && productCategory !== 'all') productQuery.category = productCategory;
        const totalProductsCount = await Product.countDocuments(productQuery);
        const products = await Product.find(productQuery).populate('category', 'name').sort({ createdAt: -1 }).skip((Number(productPage) - 1) * limit).limit(limit);

        let categoryQuery = {};
        if (categorySearch) categoryQuery.name = { $regex: categorySearch, $options: 'i' };
        const totalCategoriesCount = await Category.countDocuments(categoryQuery);
        const categories = await Category.find(categoryQuery).skip((Number(categoryPage) - 1) * limit).limit(limit);
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat._id });
            return { ...cat._doc, productCount: count };
        }));

        let reviewPipeline = [
            { $match: { isParent: true } }, 
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productInfo' } },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } }
        ];
        if (reviewCategory && reviewCategory !== 'all' && mongoose.Types.ObjectId.isValid(reviewCategory)) {
            reviewPipeline.push({ $match: { 'productInfo.category': new mongoose.Types.ObjectId(reviewCategory) } });
        }
        if (reviewSearch && String(reviewSearch).trim() !== '') {
            reviewPipeline.push({
                $match: { $or: [ { content: { $regex: reviewSearch, $options: 'i' } }, { 'productInfo.name': { $regex: reviewSearch, $options: 'i' } }, { name: { $regex: reviewSearch, $options: 'i' } } ] }
            });
        }
        if (reviewDate && String(reviewDate).trim() !== '') {
            const startOfDay = new Date(reviewDate); startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(reviewDate); endOfDay.setHours(23, 59, 59, 999);
            reviewPipeline.push({ $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } });
        }
        const totalReviewsArray = await Review.aggregate([...reviewPipeline, { $count: "total" }]);
        const totalReviewsCount = totalReviewsArray.length > 0 ? totalReviewsArray[0].total : 0;
        reviewPipeline.push({ $sort: { createdAt: -1 } }); reviewPipeline.push({ $skip: (Number(reviewPage) - 1) * limit }); reviewPipeline.push({ $limit: limit });
        const rawReviews = await Review.aggregate(reviewPipeline);
        const reviews = rawReviews.map(rv => ({ ...rv, product: rv.productInfo }));

        // KHÚC 6: XỬ LÝ LẤY NGƯỜI DÙNG
        let userQuery = {};
        if (userSearch) {
            userQuery.$or = [
                { firstName: { $regex: userSearch, $options: 'i' } },
                { lastName: { $regex: userSearch, $options: 'i' } },
                { email: { $regex: userSearch, $options: 'i' } },
                { phone: { $regex: userSearch, $options: 'i' } }
            ];
        }
        if (userRole === 'admin') userQuery.isAdmin = true;
        else if (userRole === 'customer') userQuery.isAdmin = false;

        const totalUsersCount = await User.countDocuments(userQuery);
        const users = await User.find(userQuery).sort({ createdAt: -1 }).skip((Number(userPage) - 1) * limit).limit(limit).select('-password'); 

        res.status(200).json({
            success: true, 
            totalRevenue, totalOrders: totalOrdersAll, pendingCount: pendingCountAll, shippedCount: shippedCountAll, totalProducts: productsCountAll, totalReviewsCountAll, totalUsersAll,
            daysList, revenuesList, 
            orders, totalOrdersCount,
            products, totalProductsCount,
            categories: categoriesWithCount, totalCategoriesCount,
            reviews, totalReviewsCount,
            users, totalUsersCount 
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
        res.status(200).json({ success: true, order });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateOrder = async (req, res) => {
    try {
        const { fullName, email, address, city, state, zipcode, status } = req.body;
        const isShipped = status === 'Delivered';
        
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });

        order.shippingInfo = { fullName, email, address, city, state, zipcode };
        
        if (isShipped && !order.isShipped) {
            order.isShipped = true;
            order.shippedAt = Date.now();
            
            // TĂNG SỐ LƯỢNG ĐÃ BÁN KHI GIAO THÀNH CÔNG
            const items = order.items || order.orderItems || [];
            for (const item of items) {
                const productId = item.productId || item.product;
                if (productId) {
                    await Product.findByIdAndUpdate(productId, { $inc: { sold: Number(item.quantity) || 1 } });
                }
            }
        } else if (!isShipped && order.isShipped) {
            order.isShipped = false;
            order.shippedAt = undefined;
            
            // TRỪ SỐ LƯỢNG ĐÃ BÁN NẾU ADMIN HỦY XÁC NHẬN GIAO
            const items = order.items || order.orderItems || [];
            for (const item of items) {
                const productId = item.productId || item.product;
                if (productId) {
                    await Product.findByIdAndUpdate(productId, { $inc: { sold: -(Number(item.quantity) || 1) } });
                }
            }
        }

        await order.save();
        res.status(200).json({ success: true, message: 'Cập nhật thành công!', order });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.shipOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Không thấy đơn!' });
        
        if (!order.isShipped) {
            order.isShipped = true; 
            order.shippedAt = Date.now();
            
            // Tăng số lượng đã bán cho từng sản phẩm trong đơn
            const items = order.items || order.orderItems || [];
            for (const item of items) {
                const productId = item.productId || item.product;
                if (productId) {
                    await Product.findByIdAndUpdate(productId, { $inc: { sold: Number(item.quantity) || 1 } });
                }
            }
            await order.save();
        }
        res.status(200).json({ success: true, message: `Đã xác nhận đơn hàng #${order._id}` });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });

        const items = order.items || order.orderItems || [];
        for (const item of items) {
            const productId = item.productId || item.product;
            const variantId = item.variantId || item.variant;
            if (productId && variantId) {
                const product = await Product.findById(productId);
                if (product) {
                    const variant = product.variants.find(v => v._id.toString() === variantId.toString());
                    if (variant) {
                        variant.stock += Number(item.quantity); 
                        product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                        await product.save();
                    }
                }
            }
        }
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã hủy đơn thành công!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product && product.image) {
            const possiblePaths = [
                path.join(__dirname, '../../public', product.image),
                path.join(__dirname, '../public', product.image),
                path.join(process.cwd(), 'public', product.image)
            ];
            for (let imgPath of possiblePaths) {
                if (fs.existsSync(imgPath)) { fs.unlinkSync(imgPath); break; }
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm và ảnh!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, youtubeId, screen, os, cameraBack, cameraFront, cpu, battery, variants } = req.body;

        let finalYoutubeId = youtubeId;
        if (youtubeId && youtubeId.trim() !== '') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = youtubeId.match(regExp);
            if (match && match[2].length === 11) finalYoutubeId = match[2];
            else finalYoutubeId = youtubeId.length === 11 ? youtubeId : ''; 
        }

        let productData = {
            name, category, description, youtubeId: finalYoutubeId,
            specs: { 
                screen: screen || "", os: os || "", cameraBack: cameraBack || "", 
                cameraFront: cameraFront || "", cpu: cpu || "", battery: battery || "" 
            }
        };

        if (variants && typeof variants === 'string') {
            const parsedVariants = JSON.parse(variants);
            productData.variants = parsedVariants;
            if (parsedVariants.length > 0) {
                productData.stock = parsedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                productData.price = Number(parsedVariants[0].price) || 0;
            }
        }

        if (req.file) {
            if (id && id !== "undefined") {
                const oldProduct = await Product.findById(id);
                if (oldProduct && oldProduct.image) {
                    const oldPath = path.join(process.cwd(), 'public', oldProduct.image);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }
            productData.image = `uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(id, productData, { returnDocument: 'after', runValidators: true });
        res.status(200).json({ success: true, message: 'Lưu thành công!', product });
    } catch (error) { res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message }); }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá!' });

        const productId = review.product;
        await Review.findByIdAndDelete(req.params.id);
        
        const allReviews = await Review.find({ product: productId, isParent: true, isActive: true });
        const numReviews = allReviews.length;
        const avgRating = numReviews > 0 ? (allReviews.reduce((sum, item) => item.rating + sum, 0) / numReviews) : 0;

        await Product.findByIdAndUpdate(productId, {
            rating: Number(avgRating.toFixed(1)),
            numReviews: numReviews
        });

        res.status(200).json({ success: true, message: 'Đã xóa đánh giá thành công!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) return res.status(400).json({ success: false, message: 'Danh mục đang có sản phẩm!' });
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa danh mục!' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công!', category });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.exportRevenueExcel = async (req, res) => {
    try {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Doanh Thu', { views: [{ showGridLines: false }] });

        worksheet.columns = [
            { key: 'stt', width: 10 },
            { key: 'id', width: 35 },
            { key: 'customer', width: 35 },
            { key: 'date', width: 20 },
            { key: 'amount', width: 25 }
        ];

        worksheet.mergeCells('A1', 'E1');
        const storeName = worksheet.getCell('A1');
        storeName.value = 'HỆ THỐNG CỬA HÀNG ĐIỆN THOẠI NNIT SHOP';
        storeName.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF555555' } };
        storeName.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A2', 'E2');
        const titleCell = worksheet.getCell('A2');
        titleCell.value = 'BÁO CÁO DOANH THU BÁN HÀNG';
        titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF198754' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).height = 30;

        worksheet.mergeCells('A3', 'E3');
        const dateCell = worksheet.getCell('A3');
        dateCell.value = `Thời gian trích xuất: ${new Date().toLocaleString('vi-VN')}`;
        dateCell.font = { name: 'Arial', size: 11, italic: true, color: { argb: 'FF888888' } };
        dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([]); 

        const headerRow = worksheet.getRow(5);
        headerRow.values = ['STT', 'Mã Đơn Hàng', 'Tên Khách Hàng', 'Ngày Giao', 'Tổng Tiền (VNĐ)'];
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF145A32' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        const deliveredOrders = await Order.find({ isShipped: true }).sort({ shippedAt: -1 });
        let totalRevenue = 0;
        let rowIndex = 6;

        deliveredOrders.forEach((order, index) => {
            totalRevenue += order.amountPaid;
            const row = worksheet.addRow({ 
                stt: index + 1, 
                id: order._id.toString(), 
                customer: order.shippingInfo?.fullName || 'Khách vãng lai', 
                date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('vi-VN') : 'N/A', 
                amount: order.amountPaid 
            });
            row.height = 22;
            const rowColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF8F9FA'; 
            row.eachCell((cell, colNumber) => {
                cell.font = { name: 'Arial', size: 11, color: { argb: 'FF333333' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
                cell.border = { top: { style: 'thin', color: { argb: 'FFDDDDDD' } }, left: { style: 'thin', color: { argb: 'FFDDDDDD' } }, bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } }, right: { style: 'thin', color: { argb: 'FFDDDDDD' } } };
                if (colNumber === 1 || colNumber === 4) cell.alignment = { horizontal: 'center', vertical: 'middle' };
                if (colNumber === 2 || colNumber === 3) cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
                if (colNumber === 5) cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
            });
            rowIndex++;
        });

        worksheet.getColumn('amount').numFmt = '#,##0" ₫"';
        worksheet.mergeCells(`A${rowIndex}`, `D${rowIndex}`);
        const totalRow = worksheet.getRow(rowIndex);
        totalRow.height = 30; 

        const totalTextCell = worksheet.getCell(`A${rowIndex}`);
        totalTextCell.value = 'TỔNG DOANH THU:';
        totalTextCell.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF198754' } };
        totalTextCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 2 };

        const totalValueCell = worksheet.getCell(`E${rowIndex}`);
        totalValueCell.value = totalRevenue;
        totalValueCell.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFDC3545' } };
        totalValueCell.numFmt = '#,##0" ₫"';
        totalValueCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

        totalRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } }; 
            cell.border = { top: { style: 'medium', color: { argb: 'FF198754' } }, bottom: { style: 'medium', color: { argb: 'FF198754' } }, left: { style: 'thin', color: { argb: 'FF198754' } }, right: { style: 'thin', color: { argb: 'FF198754' } } };
        });

        const footerRowIndex = rowIndex + 2;
        worksheet.mergeCells(`D${footerRowIndex}`, `E${footerRowIndex}`);
        const signatureCell = worksheet.getCell(`D${footerRowIndex}`);
        signatureCell.value = 'Người lập báo cáo';
        signatureCell.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FF333333' } };
        signatureCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        worksheet.mergeCells(`D${footerRowIndex + 1}`, `E${footerRowIndex + 1}`);
        const signatureNameCell = worksheet.getCell(`D${footerRowIndex + 1}`);
        signatureNameCell.value = '(Ký, ghi rõ họ tên)';
        signatureNameCell.font = { name: 'Arial', italic: true, size: 11, color: { argb: 'FF888888' } };
        signatureNameCell.alignment = { horizontal: 'center', vertical: 'middle' };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=BaoCao_DoanhThu_NNITShop_Chuan.xlsx');

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) { res.status(500).json({ success: false, message: "Lỗi Excel: " + error.message }); }
};

// =========================================================================
// 11. API CHO TRANG ĐÁNH GIÁ RIÊNG (CÓ LỌC THEO NGÀY)
// =========================================================================
exports.getAllReviewsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = '', date = '' } = req.query; 
        const skip = (Number(page) - 1) * Number(limit);

        let pipeline = [
            { $match: { isParent: true } }, 
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } }
        ];

        if (category && category !== '' && mongoose.Types.ObjectId.isValid(category)) {
            pipeline.push({ 
                $match: { 'productInfo.category': new mongoose.Types.ObjectId(category) } 
            });
        }

        if (search && search.trim() !== '') {
            pipeline.push({
                $match: {
                    $or: [
                        { content: { $regex: search, $options: 'i' } },
                        { 'productInfo.name': { $regex: search, $options: 'i' } },
                        { name: { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        if (date && date.trim() !== '') {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            pipeline.push({
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            });
        }

        const totalItemsArray = await Review.aggregate([...pipeline, { $count: "total" }]);
        const totalItems = totalItemsArray.length > 0 ? totalItemsArray[0].total : 0;

        const reviews = await Review.aggregate([
            ...pipeline,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: Number(limit) }
        ]);

        res.status(200).json({
            success: true, reviews, totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: Number(page)
        });
    } catch (error) { res.status(500).json({ success: false, message: "Lỗi Server: " + error.message }); }
};

// =========================================================================
// 12. TÍNH NĂNG MỚI: QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
// =========================================================================

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        
        if (user.isAdmin) {
            return res.status(400).json({ success: false, message: 'Hệ thống từ chối: Không thể xóa tài khoản Quản trị viên!' });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa tài khoản người dùng thành công!' });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        
        user.isAdmin = !user.isAdmin; 
        await user.save();
        
        const roleName = user.isAdmin ? 'Quản trị viên (Admin)' : 'Khách hàng';
        res.status(200).json({ success: true, message: `Thành công! Đã chuyển tài khoản thành: ${roleName}` });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

exports.toggleUserBlock = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        
        if (req.user && req.user._id.toString() === targetUser._id.toString()) {
            return res.status(400).json({ success: false, message: 'Hệ thống bảo vệ: Bạn không thể tự khóa tài khoản của mình!' });
        }
        
        targetUser.isBlocked = !targetUser.isBlocked;
        await targetUser.save();
        
        const status = targetUser.isBlocked ? 'đã bị KHÓA' : 'đã được MỞ KHÓA';
        res.status(200).json({ success: true, message: `Tài khoản ${targetUser.email} ${status}!` });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 14. ADMIN CHỈNH SỬA THÔNG TIN TÀI KHOẢN VÀ MẬT KHẨU
exports.updateUserAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const targetUser = await User.findById(req.params.id);
        
        if (!targetUser) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });

        // Cập nhật thông tin cơ bản
        targetUser.firstName = firstName || targetUser.firstName;
        targetUser.lastName = lastName || targetUser.lastName;
        targetUser.email = email || targetUser.email;
        targetUser.phone = phone || targetUser.phone;

        // NẾU CÓ TRUYỀN MẬT KHẨU LÊN, TIẾN HÀNH BĂM VÀ LƯU
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            targetUser.password = await bcrypt.hash(password, salt);
        }

        await targetUser.save();
        res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công!', user: targetUser });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getUserById = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id).select('-password');
        if (!targetUser) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        res.status(200).json({ success: true, user: targetUser });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

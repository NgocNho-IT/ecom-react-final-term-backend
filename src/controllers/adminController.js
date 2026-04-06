const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const excelJS = require('exceljs');

// 1. LẤY DỮ LIỆU ĐỂ HIỂN THỊ DASHBOARD
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

// 3. XÓA (HỦY) ĐƠN HÀNG VÀ HOÀN LẠI TỒN KHO
exports.deleteOrder = async (req, res) => {
    try {
        // Lấy thông tin đơn hàng trước khi xóa để biết cần hoàn lại bao nhiêu
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
        }

        // CHẠY VÒNG LẶP ĐỂ HOÀN LẠI TỒN KHO
        const items = order.items || order.orderItems || [];
        
        for (const item of items) {
            const productId = item.productId || item.product;
            const variantId = item.variantId || item.variant;
            
            if (productId && variantId) {
                const product = await Product.findById(productId);
                if (product) {
                    // Tìm đúng biến thể khách đã đặt
                    const variant = product.variants.find(v => v._id.toString() === variantId.toString());
                    if (variant) {
                        // Cộng trả lại số lượng vào kho
                        variant.stock += Number(item.quantity); 
                        
                        // Cập nhật lại Tổng tồn kho
                        product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                        
                        await product.save();
                    }
                }
            }
        }

        // Xóa đơn sau khi đã hoàn kho
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã hủy đơn và hoàn lại tồn kho thành công!' });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// 4. XÓA SẢN PHẨM (NÊN CHUYỂN TRẠNG THÁI ẨN THAY VÌ XÓA CỨNG)
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

// =========================================================================
// 5. CẬP NHẬT SẢN PHẨM (PHIÊN BẢN SUPER FULL NÂNG CẤP)
// =========================================================================
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, category, description, youtubeId, 
            screen, os, cameraBack, cameraFront, cpu, battery, 
            variants 
        } = req.body;

        // 1. FEATURE: TỰ ĐỘNG CẮT ID YOUTUBE
        let finalYoutubeId = youtubeId;
        if (youtubeId && youtubeId.trim() !== '') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = youtubeId.match(regExp);
            if (match && match[2].length === 11) {
                finalYoutubeId = match[2];
            } else {
                finalYoutubeId = youtubeId.length === 11 ? youtubeId : ''; 
            }
        }

        let productData = {
            name,
            category,
            description,
            youtubeId: finalYoutubeId,
            specs: {
                screen: screen || "",
                os: os || "",
                cameraBack: cameraBack || "",
                cameraFront: cameraFront || "",
                cpu: cpu || "",
                battery: battery || ""
            }
        };

        // 2. FEATURE: CẬP NHẬT VARIANTS & TỰ ĐỘNG TÍNH TOÁN GIÁ/KHO
        if (variants && typeof variants === 'string') {
            const parsedVariants = JSON.parse(variants);
            productData.variants = parsedVariants;

            // --- THUẬT TOÁN TỰ ĐỘNG TÍNH TOÁN ---
            if (parsedVariants.length > 0) {
                // Tổng tồn kho = Cộng dồn stock của tất cả variants
                productData.stock = parsedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                // Giá hiển thị = Lấy giá của phiên bản đầu tiên
                productData.price = Number(parsedVariants[0].price) || 0;
            }
        }

        if (req.file) {
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
            runValidators: true 
        });

        res.status(200).json({ success: true, message: 'Lưu thành công (Hệ thống đã tự tính toán Giá/Kho)!', product });
    } catch (error) {
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

// 8. HÀM XUẤT EXCEL
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
        const today = new Date();
        dateCell.value = `Thời gian trích xuất: ${today.toLocaleTimeString('vi-VN')} - Ngày ${today.toLocaleDateString('vi-VN')}`;
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
            cell.border = { top: { style: 'thin', color: { argb: 'FF145A32' } }, left: { style: 'thin', color: { argb: 'FF145A32' } }, bottom: { style: 'thin', color: { argb: 'FF145A32' } }, right: { style: 'thin', color: { argb: 'FF145A32' } } };
        });

        const deliveredOrders = await Order.find({ isShipped: true }).sort({ shippedAt: -1 });
        let totalRevenue = 0;
        let rowIndex = 6;

        deliveredOrders.forEach((order, index) => {
            totalRevenue += order.amountPaid;
            const row = worksheet.addRow({ stt: index + 1, id: order._id.toString(), customer: order.shippingInfo?.fullName || 'Khách vãng lai', date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('vi-VN') : 'N/A', amount: order.amountPaid });
            row.height = 22;

            const isEven = index % 2 === 0;
            const rowColor = isEven ? 'FFFFFFFF' : 'FFF8F9FA'; 

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
    } catch (error) {
        console.error("Lỗi xuất Excel:", error);
        res.status(500).json({ success: false, message: "Lỗi tạo file Excel: " + error.message });
    }
};
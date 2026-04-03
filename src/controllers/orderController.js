const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Xử lý thanh toán (Tương đương process_checkout)
exports.processCheckout = async (req, res) => {
    try {
        const { shippingInfo, amountPaid } = req.body;
        
        // 1. Lấy giỏ hàng của user
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống' });
        }

        let orderItems = [];

        // 2. Lặp qua từng món trong giỏ để đối chiếu giá và trừ tồn kho
        for (let item of cart.items) {
            const product = await Product.findById(item.productId);
            // Tìm đúng phiên bản (màu sắc, dung lượng) khách chọn
            const variant = product.variants.id(item.variantId);

            if (!variant) continue;

            // Xác định giá bán hiện tại
            const price = variant.isSale ? variant.salePrice : variant.price;

            orderItems.push({
                product: product._id,
                variantId: variant._id,
                name: `${product.name} - ${variant.storageCapacity} ${variant.colorName}`,
                quantity: item.quantity,
                price: price
            });

            // TRỪ TỒN KHO (Giống hệt variant.stock -= qty trong Django)
            variant.stock -= item.quantity;
            await product.save();
        }

        // 3. Tạo Đơn hàng mới
        const newOrder = new Order({
            user: req.user._id,
            shippingInfo,
            orderItems,
            amountPaid
        });

        await newOrder.save();

        // 4. Xóa sạch giỏ hàng sau khi đặt thành công
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, message: 'Đơn hàng đã được đặt thành công!', orderId: newOrder._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy lịch sử mua hàng của user (Tương đương orders)
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết 1 đơn hàng (Tương đương order_detail)
exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
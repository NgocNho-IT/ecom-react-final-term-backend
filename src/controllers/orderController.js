const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.processCheckout = async (req, res) => {
    try {
        // Nhận thêm paymentMethod, isPaid và note từ Frontend
        const { shippingInfo, amountPaid, paymentMethod, isPaid, note } = req.body;
        
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống' });
        }

        let orderItems = [];

        for (let item of cart.items) {
            const product = await Product.findById(item.productId);
            const variant = product.variants.id(item.variantId);

            if (!variant) continue;
            const price = variant.isSale ? variant.salePrice : variant.price;

            orderItems.push({
                product: product._id,
                variantId: variant._id,
                name: `${product.name} - ${variant.storageCapacity} ${variant.colorName}`,
                quantity: item.quantity,
                price: price
            });
            variant.stock -= item.quantity;
            await product.save();
        }

        // Lưu đơn hàng với các trường mới
        const newOrder = new Order({
            user: req.user._id,
            shippingInfo,
            orderItems,
            amountPaid,
            paymentMethod: paymentMethod || 'COD',
            isPaid: isPaid || false,
            note: note || ''
        });

        await newOrder.save();

        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, message: 'Đơn hàng đã được đặt thành công!', orderId: newOrder._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
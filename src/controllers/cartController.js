const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId', 'name image variants');
        res.status(200).json({ success: true, cart: cart || { items: [] } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.variantId.toString() === variantId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({ productId, variantId, quantity: parseInt(quantity) });
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { variantId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ success: false, message: 'Giỏ hàng trống' });

        const itemIndex = cart.items.findIndex(item => item.variantId.toString() === variantId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = parseInt(quantity);
            await cart.save();
            res.status(200).json({ success: true, message: 'Đã cập nhật số lượng' });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { variantId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = cart.items.filter(item => item.variantId.toString() !== variantId);
            await cart.save();
        }
        res.status(200).json({ success: true, message: 'Đã xóa khỏi giỏ hàng' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
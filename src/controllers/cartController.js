const Cart = require('../models/Cart');

// Lấy giỏ hàng của user hiện tại (Tương đương cart_summary)
exports.getCart = async (req, res) => {
    try {
        // req.user._id sẽ được lấy từ Middleware xác thực (JWT)
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId', 'name image variants');
        res.status(200).json({ success: true, cart: cart || { items: [] } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Thêm vào giỏ hàng (Tương đương cart_add)
exports.addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Nếu chưa có giỏ hàng thì tạo mới
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Kiểm tra xem sản phẩm cấu hình này đã có trong giỏ chưa
        const itemIndex = cart.items.findIndex(item => item.variantId.toString() === variantId);

        if (itemIndex > -1) {
            // Đã có -> Tăng số lượng
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            // Chưa có -> Thêm mới vào mảng
            cart.items.push({ productId, variantId, quantity: parseInt(quantity) });
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật số lượng (Tương đương cart_update)
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

// Xóa khỏi giỏ (Tương đương cart_delete)
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
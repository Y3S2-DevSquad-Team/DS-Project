const Cart = require("../models/cartModel");

// 🛒 Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, foodId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.foodId === foodId);
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🗑 Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, foodId } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.foodId !== foodId);
        await cart.save();

        res.status(200).json({ message: "Item removed", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📜 Get cart items
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 🗑 Clear cart after placing order
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        await Cart.deleteOne({ userId });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

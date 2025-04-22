const axios = require("axios"); // To call Cart Service
const Order = require("../models/Order");

// Place order from cart
exports.placeOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch cart items from Cart Microservice
        const cartResponse = await axios.get(`http://localhost:5001/api/cart/${userId}`);
        if (!cartResponse.data || cartResponse.data.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const cartItems = cartResponse.data.items;

        // Calculate total price (Assume each food has a fixed price for simplicity)
        let totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * 10, 0); // Example: $10 per item

        // Create new order
        const newOrder = new Order({ userId, items: cartItems, totalPrice });
        await newOrder.save();

        // Clear cart after placing order
        await axios.post(`http://localhost:5001/api/cart/clear`, { userId });

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const Order = require("../models/Order");
const Cart = require("../models/Cart");

class OrderService {
    // Create an order from the cart
    static async createOrder(userId, totalAmount) {
        try {
            // Find the user's cart
            const cart = await Cart.findOne({ userId });

            if (!cart || cart.items.length === 0) {
                throw new Error("Cart is empty. Add items before placing an order.");
            }

            // Create an order from cart items
            const newOrder = new Order({
                userId,
                items: cart.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount
            });

            await newOrder.save();

            // Clear the cart after placing the order
            await Cart.findOneAndDelete({ userId });

            return newOrder;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get all orders of a user
    static async getOrdersByUser(userId) {
        try {
            return await Order.find({ userId }).populate("items.productId");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get a single order by ID
    static async getOrderById(orderId) {
        try {
            return await Order.findById(orderId).populate("items.productId");
        } catch (error) {
            throw new Error("Order not found");
        }
    }

    // Update order status
    static async updateOrderStatus(orderId, status) {
        try {
            return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Delete an order
    static async deleteOrder(orderId) {
        try {
            return await Order.findByIdAndDelete(orderId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = OrderService;


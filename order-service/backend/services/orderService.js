const Order = require('../models/Order');

class OrderService {
    // Create a new order
    static async createOrder(userId, items, totalAmount) {
        try {
            const newOrder = new Order({ userId, items, totalAmount });
            return await newOrder.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get all orders of a user
    static async getOrdersByUser(userId) {
        try {
            return await Order.find({ userId }).populate('items.productId');
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get a single order by ID
    static async getOrderById(orderId) {
        try {
            return await Order.findById(orderId).populate('items.productId');
        } catch (error) {
            throw new Error('Order not found');
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


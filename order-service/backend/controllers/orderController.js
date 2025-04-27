const mongoose = require('mongoose');
const Product = require('../models/Product'); // Ensure this import is present
const OrderService = require('../services/orderService'); // Your service

// In your order controller
// In your backend order controller (likely orderController.js)
exports.createOrder = async (req, res) => {
    try {
      console.log('Received order data:', req.body); // Add this line
      
      const order = new Order({
        userId: req.body.userId || 'guest',
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        status: 'pending'
      });
  
      const savedOrder = await order.save();
      console.log('Order saved:', savedOrder); // Add this line
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Order creation error:', error); // Add this line
      res.status(500).json({ 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

// Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await OrderService.getOrdersByUser(userId);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific order by its ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await OrderService.getOrderById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order Status (e.g., "Pending" → "Shipped")
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedOrder = await OrderService.updateOrderStatus(req.params.orderId, status);

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Order (Only if it's still "Pending" or "Processing")
exports.cancelOrder = async (req, res) => {
    try {
        const order = await OrderService.getOrderById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (["Shipped", "Delivered"].includes(order.status)) {
            return res.status(400).json({ message: "Cannot cancel an order that has already been shipped or delivered" });
        }

        // Update status to "Cancelled"
        const cancelledOrder = await OrderService.updateOrderStatus(req.params.orderId, "Cancelled");
        res.json({ message: "Order has been cancelled", order: cancelledOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an Order (Only if it's not shipped or delivered)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await OrderService.getOrderById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (["Shipped", "Delivered"].includes(order.status)) {
            return res.status(400).json({ message: "Cannot delete an order that has already been shipped or delivered" });
        }

        await OrderService.deleteOrder(req.params.orderId);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

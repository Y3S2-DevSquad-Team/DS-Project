const Order = require("../models/OrderModel");

const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls"); // Path where you keep service URLs

const createOrder = async (req, res, next) => {
  try {
    const { userId, restaurantId, restaurantName, items, totalAmount, deliveryAddress } = req.body;

    if (!userId || !restaurantId || !restaurantName || !items || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    // ✅ Validate Restaurant exists
    try {
      const restaurantResponse = await axios.get(`${SERVICE_URLS.RESTAURANT_SERVICE}/${restaurantId}`);
      if (!restaurantResponse.data) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
    } catch (error) {
      console.error("[Validation Error] Restaurant not found");
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // 🚀 Trigger Delivery Service (Assign driver)
    try {
      await axios.post(`${SERVICE_URLS.DELIVERY_SERVICE}/assign`, {
        orderId: createdOrder._id,
        customerLocation: {
          lat: 6.9271, // You should pass actual customer lat/lng from deliveryAddress if available
          lng: 79.8612,
        },
      });
      console.log("[Trigger] Delivery assigned for order");
    } catch (err) {
      console.error("[Error] Failed to assign delivery", err.message);
    }

    // 🚀 Trigger Payment Service (Create Payment)
    try {
      await axios.post(`${SERVICE_URLS.PAYMENT_SERVICE}/initiate`, {
        orderId: createdOrder._id,
        userId: createdOrder.userId,
        amount: createdOrder.totalAmount,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
      });
      console.log("[Trigger] Payment record created");
    } catch (err) {
      console.error("[Error] Failed to initiate payment", err.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (in real app, would be private with auth)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders/user/:userId
// @access  Public (in real app, would be private with auth)
const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a restaurant
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Public (in real app, would be private with auth)
const getOrdersByRestaurant = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (in real app, would be private with auth)
// controllers/orderController.js
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ["pending", "processing", "completed", "cancelled", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses: validStatuses,
      });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public (in real app, would be private with auth)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.json({ message: "Order removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByRestaurant,
  updateOrderStatus,
  deleteOrder,
};

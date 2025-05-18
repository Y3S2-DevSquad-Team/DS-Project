const Order = require("../models/OrderModel");

const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls"); // Path where you keep service URLs

const createOrder = async (req, res, next) => {
  try {
    const {
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      deliveryCoords, // ✅ ADD THIS
      ...paymentFields // ✅ FORWARD EXTRAS LIKE name, email, etc.
    } = req.body;

    if (!userId || !restaurantId || !restaurantName || !items || !totalAmount || !deliveryAddress || !deliveryCoords) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Validate user via User Service
    try {
      const userResponse = await axios.get(`${SERVICE_URLS.USER_SERVICE}/api/auth/${userId}`);
      if (!userResponse.data) return res.status(400).json({ message: "Invalid user ID" });
    } catch (err) {
      console.error("[Validation Error] User not found");
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ✅ Validate restaurant
    try {
      const restaurantResponse = await axios.get(`${SERVICE_URLS.RESTAURANT_SERVICE}/api/restaurant/${restaurantId}`);
      if (!restaurantResponse.data) return res.status(400).json({ message: "Invalid restaurant ID" });
    } catch (error) {
      console.error("[Validation Error] Restaurant not found");
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // ✅ Save order
    const order = await Order.create({
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
    });

    // ✅ Trigger Delivery Service
    try {
      await axios.post(`${SERVICE_URLS.DELIVERY_SERVICE}/api/delivery/assign`, {
        orderId: order._id,
        customerLocation: deliveryCoords,
      });
    } catch (err) {
      console.error("[Delivery Error]", err.message);
    }

    // ✅ Trigger Payment Service
    try {
      await axios.post(`${SERVICE_URLS.PAYMENT_SERVICE}/api/payment/initiate`, {
        orderId: order._id,
        userId,
        amount: totalAmount,
        ...paymentFields
      });
    } catch (err) {
      console.error("[Payment Error]", err.message);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};


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

const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrdersByRestaurant = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

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

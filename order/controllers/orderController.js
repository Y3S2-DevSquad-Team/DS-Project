const Order = require("../models/OrderModel");

const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls"); // Path where you keep service URLs

const createOrder = async (req, res, next) => {
  try {
    const { userId, restaurantId, restaurantName, items, totalAmount, deliveryAddress, deliveryCoords, ...paymentFields } = req.body;

    // Debugging - log incoming request data
    console.log("Request body:", req.body);
    console.log("userId type:", typeof userId);

    // Validate required fields
    if (!userId || !restaurantId || !restaurantName || !items || !totalAmount || !deliveryAddress || !deliveryCoords) {
      return res.status(400).json({
        message: "Missing required fields",
        received: {
          hasUserId: !!userId,
          hasRestaurantId: !!restaurantId,
          hasRestaurantName: !!restaurantName,
          hasItems: !!items,
          hasTotalAmount: !!totalAmount,
          hasDeliveryAddress: !!deliveryAddress,
          hasDeliveryCoords: !!deliveryCoords,
        },
      });
    }

    // Check items structure
    const validItems = items.every((item) => item.menuItemId && item.itemName && item.quantity && item.price !== undefined);

    if (!validItems) {
      return res.status(400).json({
        message: "Invalid items structure. Each item must have menuItemId, itemName, quantity, and price",
        receivedItems: items,
      });
    }

    // Validate user via User Service
    // try {
    //   console.log("Making request to user service:", `${SERVICE_URLS.USER_SERVICE}/api/auth/${userId}`);
    //   const userResponse = await axios.get(`${SERVICE_URLS.USER_SERVICE}/api/auth/${userId}`);
    //   console.log("User service response:", userResponse.data);

    //   if (!userResponse.data) {
    //     return res.status(400).json({ message: "Invalid user ID - no data returned" });
    //   }
    // } catch (err) {
    //   console.error("[Validation Error] User not found:", err.message);
    //   if (err.response) {
    //     console.error("Error response data:", err.response.data);
    //     console.error("Error response status:", err.response.status);
    //   }
    //   return res.status(400).json({
    //     message: "Invalid user ID",
    //     error: err.message
    //   });
    // }

    // Rest of the function remains the same...
    // Validate restaurant
    // try {
    //   const restaurantResponse = await axios.get(`${SERVICE_URLS.RESTAURANT_SERVICE}/api/restaurants/${restaurantId}`);
    //   if (!restaurantResponse.data) return res.status(400).json({ message: "Invalid restaurant ID" });
    // } catch (error) {
    //   console.error("[Validation Error] Restaurant not found");
    //   return res.status(400).json({ message: "Invalid restaurant ID" });
    // }

    // Save order with deliveryCoords
    const order = await Order.create({
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      deliveryCoords,
    });

    // Trigger Delivery Service
    // try {
    //   await axios.post(`${SERVICE_URLS.DELIVERY_SERVICE}/api/delivery/assign`, {
    //     orderId: order._id,
    //     customerLocation: deliveryCoords,
    //   });
    // } catch (err) {
    //   console.error("[Delivery Error]", err.message);
    // }

    // // Trigger Payment Service
    // try {
    //   await axios.post(`${SERVICE_URLS.PAYMENT_SERVICE}/api/payment/initiate`, {
    //     orderId: order._id,
    //     userId,
    //     amount: totalAmount,
    //     ...paymentFields
    //   });
    // } catch (err) {
    //   console.error("[Payment Error]", err.message);
    // }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error in createOrder:", error);
    next(error);
  }
};

// Rest of the controller remains the same...
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
    // Updated to use modern deletion method
    const result = await Order.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

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

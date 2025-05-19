const express = require("express");
const authToken = require("../middleware/authToken");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByRestaurant,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// 🟢 Place specific routes first
router.get("/user/:userId", getOrdersByUser);
router.get("/restaurant/:restaurantId", getOrdersByRestaurant);

// 🟡 General routes after
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;

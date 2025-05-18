// routes/orderRoutes.js
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

router.post("/", authToken, createOrder);
router.get("/:id", authToken, getOrderById);
router.get("/user/:userId", authToken, getOrdersByUser);
router.get("/restaurant/:restaurantId", authToken, getOrdersByRestaurant);
router.put("/:id/status", authToken, updateOrderStatus);
router.delete("/:id", authToken, deleteOrder);

module.exports = router;

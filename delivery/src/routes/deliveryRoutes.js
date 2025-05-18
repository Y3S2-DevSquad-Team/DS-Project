const express = require("express");
const router = express.Router();
const authToken = require("../middleware/authToken");
const {
  assignDelivery,
  updateStatus,
  updateLocation,
  getStatusByOrderId,
  getDeliveriesForDriver,
  getAvailableDeliveries,
  acceptDelivery,
  markPickedUp,
  markDelivered
  
} = require("../controllers/deliveryController");

// Assign a delivery to a driver
router.post("/assign", authToken, assignDelivery);

// Update delivery status (accepted, picked, delivered)
router.patch("/update/:id", authToken, updateStatus);

// Update driver’s live location
router.patch("/location/:id", authToken, updateLocation);

// Get delivery status (customer view)
router.get("/status/:orderId", authToken, getStatusByOrderId);

// Get deliveries for a specific driver
router.get("/driver/:driverId", authToken, getDeliveriesForDriver);

router.get("/available", authToken, getAvailableDeliveries);

router.patch("/accept/:id", authToken, acceptDelivery);

router.patch('/pickup/:id', authToken, markPickedUp);

router.patch('/deliver/:id', authToken, markDelivered);

module.exports = router;

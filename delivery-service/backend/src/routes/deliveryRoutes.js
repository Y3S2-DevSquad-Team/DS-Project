const express = require("express");
const router = express.Router();
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
router.post("/assign", assignDelivery);

// Update delivery status (accepted, picked, delivered)
router.patch("/update/:id", updateStatus);

// Update driver’s live location
router.patch("/location/:id", updateLocation);

// Get delivery status (customer view)
router.get("/status/:orderId", getStatusByOrderId);

// Get deliveries for a specific driver
router.get("/driver/:driverId", getDeliveriesForDriver);

router.get("/available", getAvailableDeliveries);

router.patch("/accept/:id", acceptDelivery);

router.patch('/pickup/:id', markPickedUp);

router.patch('/deliver/:id', markDelivered);



module.exports = router;

const Delivery = require("../models/Delivery");
const haversine = require("../utils/haversine");
const statusCodes = require("../utils/statusCodes");
const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls"); // Path where you keep service URLs

const { assignDeliverySchema } = require("../validators/deliveryValidator");

// 1️⃣ Create Delivery (unassigned)
exports.assignDelivery = async (req, res) => {
  try {
    const { error } = assignDeliverySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { orderId, customerLocation } = req.body;

    const delivery = await Delivery.create({
      orderId,
      driverId: null, // no driver assigned yet
      customerLocation,
      driverLocation: { lat: null, lng: null },
      status: "unassigned",
    });

    console.log("[Delivery] Created available delivery:", delivery._id);
    res.status(201).json({ message: "Delivery created successfully", delivery });
  } catch (err) {
    console.error("[Error] assignDelivery:", err);
    res.status(500).json({ message: "Failed to create delivery" });
  }
};

// 2️⃣ Rider accepts a delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const { driverId } = req.body; // ✅ Correct: read from body

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    if (delivery.status !== "unassigned") {
      return res.status(400).json({ message: "Delivery already assigned" });
    }

    if (!driverId) {
      return res.status(400).json({ message: "Missing driverId" });
    }

    delivery.driverId = driverId; // ✅ Set the driverId received
    delivery.status = "assigned";

    await delivery.save();

    res.json({ message: "Delivery assigned successfully", delivery });
  } catch (error) {
    console.error("[Error] acceptDelivery:", error);
    res.status(500).json({ message: "Failed to accept delivery" });
  }
};

// Update status (driver marks progress)
exports.updateStatus = async (req, res) => {
  try {
    const { status, lat, lng } = req.body;
    const { id } = req.params;

    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = status;

    // ✅ If driver sent updated location, save it
    if (lat !== undefined && lng !== undefined) {
      delivery.driverLocation = { lat, lng };
    }

    await delivery.save();

    console.log(`[Delivery] Status updated: ${status} with location update`);
    res.json({ message: "Status updated", delivery });
  } catch (err) {
    console.error("[Error] updateStatus:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};


// Update driver location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { id } = req.params;

    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.driverLocation = { lat, lng };
    await delivery.save();

    console.log(`[Delivery] Location updated for: ${id}`);
    res.json({ message: "Driver location updated", delivery });
  } catch (err) {
    console.error("[Error] updateLocation:", err);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// Get delivery status by order ID
exports.getStatusByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    res.json({
      status: delivery.status,
      driverLocation: delivery.driverLocation,
    });
  } catch (err) {
    console.error("[Error] getStatusByOrderId:", err);
    res.status(500).json({ message: "Failed to fetch delivery status" });
  }
};

// Get all deliveries for a driver
exports.getDeliveriesForDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const deliveries = await Delivery.find({ driverId });

    res.json({ deliveries });
  } catch (err) {
    console.error("[Error] getDeliveriesForDriver:", err);
    res.status(500).json({ message: "Failed to fetch deliveries" });
  }
};

// 1️⃣ Get all available deliveries (unassigned)
exports.getAvailableDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: "unassigned" });
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch available deliveries" });
  }
};

// Mark Delivery as Picked Up
exports.markPickedUp = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = "picked";
    await delivery.save();

    res.json({ message: "Marked as picked up", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark pickup" });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = "delivered";
    await delivery.save();

    console.log("[Delivery] Marked as delivered");

    // 🚀 Update Order Status to Delivered
    try {
      await axios.put(`${SERVICE_URLS.ORDER_SERVICE}/${delivery.orderId}/status`, {
        status: "delivered",
      });
      console.log("[Trigger] Order status updated to delivered");
    } catch (err) {
      console.error("[Error] Failed to update order after delivery", err.message);
    }

    res.json({ message: "Delivery completed", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark as delivered" });
  }
};

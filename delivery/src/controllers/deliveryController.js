const Delivery = require("../models/Delivery");
const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls"); // Path where you keep service URLs

const { assignDeliverySchema } = require("../validators/deliveryValidator");

const mongoose = require("mongoose");

// 1️⃣ Create Delivery (unassigned)
exports.assignDelivery = async (req, res) => {
  try {
    console.log("[Delivery API] Received assign request with body:", JSON.stringify(req.body));

    // Validate request body against schema
    const { error } = assignDeliverySchema.validate(req.body);
    if (error) {
      console.error("[Delivery API] Validation error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { orderId, customerLocation, restaurantName, items } = req.body;

    // Ensure orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("[Delivery API] Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    // Validate customerLocation
    if (!customerLocation || typeof customerLocation.lat !== "number" || typeof customerLocation.lng !== "number") {
      console.error("[Delivery API] Invalid customerLocation:", customerLocation);
      return res.status(400).json({ message: "Invalid customerLocation format" });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      console.error("[Delivery API] Invalid items array:", items);
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    // Convert orderId to ObjectId
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    // Create delivery
    console.log("[Delivery API] Creating delivery with orderId:", orderObjectId);
    const delivery = await Delivery.create({
      orderId: orderObjectId,
      driverId: null,
      restaurantName,
      items,
      customerLocation,
      driverLocation: { lat: null, lng: null },
      status: "unassigned",
    });

    console.log("[Delivery API] Created available delivery:", delivery._id);
    res.status(201).json({ message: "Delivery created successfully", delivery });
  } catch (err) {
    console.error("[Error] assignDelivery:", err);
    res.status(500).json({ message: `Failed to create delivery: ${err.message}` });
  }
};

// 2️⃣ Rider accepts a delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const { driverId } = req.body;

    const activeDelivery = await Delivery.findOne({
      driverId,
      status: { $in: ["assigned", "accepted", "picked"] },
    });

    if (activeDelivery) {
      return res.status(400).json({ message: "You already have an active delivery" });
    }

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

    // ✅ Save status timestamp
    delivery.statusTimestamps[status] = new Date();

    // ✅ Save driver location if available
    if (lat !== undefined && lng !== undefined) {
      delivery.driverLocation = { lat, lng };
    }

    await delivery.save();

    console.log(`[Delivery] Status updated to "${status}" with timestamp`);
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

    // ✅ Check BEFORE updating
    if (delivery.driverLocation.lat === lat && delivery.driverLocation.lng === lng) {
      return res.status(200).json({ message: "No change in location" });
    }

    // ✅ Proceed with update
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

    let success = false,
      attempts = 0;
    while (!success && attempts < 3) {
      try {
        await axios.put(`${SERVICE_URLS.ORDER_SERVICE}/${delivery.orderId}/status`, {
          status: "delivered",
        });
        success = true;
      } catch (err) {
        attempts++;
        console.error(`[Retry ${attempts}] Order status update failed`);
        await new Promise((r) => setTimeout(r, 1000 * attempts));
      }
    }

    if (!success) {
      // Log to DB or alert for manual follow-up
      console.error("🚨 Order status not updated after 3 tries");
    }

    res.json({ message: "Delivery completed", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark as delivered" });
  }
};

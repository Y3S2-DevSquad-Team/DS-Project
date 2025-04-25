const Delivery = require("../models/Delivery");
const haversine = require("../utils/haversine");
const statusCodes = require("../utils/statusCodes");

const { assignDeliverySchema } = require("../validators/deliveryValidator");

// Assign driver (mock logic for now)
exports.assignDelivery = async (req, res) => {
  try {
    // ✅ Validate input first
    const { error } = assignDeliverySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { orderId, customerLocation } = req.body;

    // TODO: replace with real driver lookup
    const mockDriverId = "64e1f3541d53270012345678";
    const driverLocation = { lat: 6.902, lng: 79.858 };

    const delivery = await Delivery.create({
      orderId,
      driverId: mockDriverId,
      customerLocation,
      driverLocation,
      status: "assigned",
    });

    console.log("[Delivery] Assigned delivery:", delivery._id);
    res.status(201).json({ message: "Driver assigned", delivery });
  } catch (err) {
    console.error("[Error] assignDelivery:", err);
    res.status(500).json({ message: "Failed to assign delivery" });
  }
};

// Update status (driver marks progress)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = status;
    await delivery.save();

    console.log(`[Delivery] Status updated: ${status}`);
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

// 2️⃣ Rider accepts a delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    if (delivery.status !== "unassigned") {
      return res.status(400).json({ message: "Delivery already assigned" });
    }

    delivery.driverId = req.user._id; // from token after auth integration
    delivery.status = "assigned";

    await delivery.save();
    res.json({ message: "Delivery assigned successfully", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to accept delivery" });
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


// Mark Delivery as Delivered
exports.markDelivered = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = "delivered";
    await delivery.save();

    res.json({ message: "Delivery completed", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark as delivered" });
  }
};

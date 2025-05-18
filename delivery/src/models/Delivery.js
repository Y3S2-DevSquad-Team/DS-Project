const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    driverLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    status: {
      type: String,
      enum: ["unassigned", "assigned", "accepted", "picked", "delivered", "cancelled"],
      default: "unassigned", 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);

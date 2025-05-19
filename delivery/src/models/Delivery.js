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
    restaurantName: {
      type: String,
      required: true,
    },
    items: [
      {
        menuItemId: { type: String, required: true },
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
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
    statusTimestamps: {
      unassigned: { type: Date, default: Date.now },
      assigned: { type: Date },
      accepted: { type: Date },
      picked: { type: Date },
      delivered: { type: Date },
      cancelled: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);

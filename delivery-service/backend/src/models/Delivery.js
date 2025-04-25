const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order" // even if Order is external, we keep logical reference
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      ref: "User" // reference from Auth Service
    },

    customerLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },

    driverLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "accepted", "picked", "delivered", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);

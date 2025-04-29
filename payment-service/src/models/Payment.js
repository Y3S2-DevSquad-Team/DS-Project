const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order", // even if Order is external, we keep logical reference
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // 🔄 Will use Auth service in the future
      ref: "User", // reference from Auth Service
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "LKR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    payherePaymentId: {
      type: String,
    },
    method: {
      type: String,
    },
    cardHolderName: {
      type: String,
    },
    transactionDate: {
      type: Date,
    },
    payhereRaw: {
      type: Object, // to store full response from PayHere
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);

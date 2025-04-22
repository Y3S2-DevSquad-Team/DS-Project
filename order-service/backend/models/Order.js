const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            foodId: { type: String, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // "Pending", "Completed"
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

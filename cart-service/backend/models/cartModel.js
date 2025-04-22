const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      foodId: { type: String, required: true },
      name: { type: String, required: true },       // New
      price: { type: Number, required: true },       // New
      quantity: { type: Number, required: true, min: 1 },
    }
  ]
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;


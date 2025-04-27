const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Added name field
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  // Any other relevant item fields can go here
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User' },  // Can be optional if needed
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  // Additional useful fields
  deliveryAddress: { type: String },
  contactNumber: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);
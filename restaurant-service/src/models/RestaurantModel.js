const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  openingHours: {
    type: String,
    required: true
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true }
  },
  ownerId: {
    type: String,
    required: true
  },
  // Add reference to orders
  currentOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  maxActiveOrders: {
    type: Number,
    default: 20  // Example limit
  }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
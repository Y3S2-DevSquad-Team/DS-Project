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
  /* ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true
  },*/

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
  },

  /*after connecting to order
orderLimit: {
  type: Number,
  default: 70
},
currentOrderCount: {
  type: Number,
  default: 0
},
pendingOrders: [{
  orderId: String, // Will be replaced with ObjectId when connected
  items: [{
    name: String,
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },*/


  // Add this to your RestaurantSchema
menuItems: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'MenuItem'
}]
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
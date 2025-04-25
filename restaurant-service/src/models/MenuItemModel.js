const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // This creates a reference to the Restaurant model
    required: true
  }, image: {
    type: String, // This will store the URL/path to the image
    required: false // Make it optional if you want
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
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = MenuItem;
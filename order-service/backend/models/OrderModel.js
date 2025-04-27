const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Reference to User service (only stores the ID)
    userId: { 
        type: String, 
        required: true,
       
    },
    
    // Reference to Restaurant service
    restaurantId: {
        type: String,
        required: true,
      
    },
    
    // Restaurant name is denormalized here to avoid frequent lookups
    restaurantName: {
        type: String,
        required: true
    },
    
    // Order items array
    items: [
        {
            // Reference to Menu Item (if needed)
            menuItemId: { 
                type: String,
                required: true
            },
            itemName: {
                type: String,
                required: true
            },
            quantity: { 
                type: Number, 
                required: true,
                min: 1
            },
            price: { 
                type: Number, 
                required: true,
                min: 0
            }
        }
    ],
    
    // Calculated total
    totalAmount: { 
        type: Number, 
        required: true,
        min: 0
    },
    
    // Order status
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'cancelled', 'delivered'],
        default: 'pending' 
    },
    
    // Timestamps
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    // Delivery information (optional)
    deliveryAddress: {
        type: String,
        required: true
    },
    
    // Payment reference (if applicable)
    paymentId: {
        type: String
    }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema); 
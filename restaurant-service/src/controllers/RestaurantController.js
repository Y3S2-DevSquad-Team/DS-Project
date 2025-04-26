const Restaurant = require('../models/RestaurantModel.js');

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single restaurant
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menuItems');  // This will include full menu item documents
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update restaurant
// Full update of restaurant (all fields required)
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      address,
      contactNumber,
      openingHours,
      availability,
      ownerId
    } = req.body;

    // Validate required fields
    if (!name || !address || !contactNumber || !openingHours || !availability || !ownerId) {
      return res.status(400).json({ error: 'All fields are required for full update' });
    }

    // Validate all 7 days are present in availability
    const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasAllDays = requiredDays.every(day => availability[day] !== undefined);
    
    if (!hasAllDays) {
      return res.status(400).json({ 
        error: 'Availability must include all 7 days (monday through sunday)' 
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        name,
        description,
        address,
        contactNumber,
        openingHours,
        availability,
        ownerId
      },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add order to restaurant's current orders
const addOrderToRestaurant = async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if restaurant can accept more orders
    if (restaurant.currentOrders.length >= restaurant.maxActiveOrders) {
      return res.status(400).json({ message: 'Restaurant is at maximum order capacity' });
    }

    restaurant.currentOrders.push(orderId);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Move order from current to history (when completed)
const completeOrder = async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Remove from current orders
    restaurant.currentOrders = restaurant.currentOrders.filter(
      id => id.toString() !== orderId
    );

    // Add to order history
    restaurant.orderHistory.push(orderId);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* for order

const getOrderDashboard = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('pendingOrders currentOrderCount orderLimit');
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id, orderId } = req.params;
    const { status } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orderIndex = restaurant.pendingOrders.findIndex(
      order => order.orderId === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    restaurant.pendingOrders[orderIndex].status = status;

    // If accepted, increment current order count
    if (status === 'accepted') {
      if (restaurant.currentOrderCount >= restaurant.orderLimit) {
        return res.status(400).json({ message: 'Order limit reached' });
      }
      restaurant.currentOrderCount += 1;
    }

    // If rejected and was previously accepted, decrement count
    if (status === 'rejected' && 
        restaurant.pendingOrders[orderIndex].status === 'accepted') {
      restaurant.currentOrderCount = Math.max(0, restaurant.currentOrderCount - 1);
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */


module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addOrderToRestaurant,
  completeOrder
};
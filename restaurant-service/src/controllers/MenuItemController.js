const MenuItem = require('../models/MenuItemModel.js');
const Restaurant = require('../models/RestaurantModel.js');

const createMenuItem = async (req, res) => {
  try {
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Create menu item with image path if available
    const menuItemData = {
      ...req.body,
      imagePath: req.file ? req.file.path : null
    };

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    
    restaurant.menuItems.push(menuItem._id);
    await restaurant.save();

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update getMenuItems to populate restaurant info if needed
const getMenuItems = async (req, res) => {
  try {
    // Validate restaurant exists first
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single menu item
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
};
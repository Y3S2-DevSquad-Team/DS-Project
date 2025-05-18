const MenuItem = require("../models/MenuItemModel.js");
const Restaurant = require("../models/RestaurantModel.js");

// Modify createMenuItem to include restaurant validation
const createMenuItem = async (req, res) => {
  try {
    // 1. Check if restaurant exists
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // 2. Create the menu item
    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    // 3. Add menu item to restaurant's menuItems array
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
      return res.status(404).json({ error: "Restaurant not found" });
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
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
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
      return res.status(404).json({ message: "Menu item not found" });
    }
    await Restaurant.findByIdAndUpdate(menuItem.restaurantId, {
      $pull: { menuItems: menuItem._id },
    });

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate("restaurantId", "name");
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
};

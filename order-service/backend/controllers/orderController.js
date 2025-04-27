// controllers/orderController.js
const Order = require('../models/orderModel'); // Assuming you have an Order model defined

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (in real app, would be private with auth)
const createOrder = async (req, res, next) => {
  try {
    const { 
      userId, 
      restaurantId, 
      restaurantName, 
      items, 
      totalAmount, 
      deliveryAddress,
      paymentId 
    } = req.body;

    // Validate required fields
    if (!userId || !restaurantId || !restaurantName || !items || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array' });
    }

    const order = new Order({
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      paymentId
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (in real app, would be private with auth)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders/user/:userId
// @access  Public (in real app, would be private with auth)
const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a restaurant
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Public (in real app, would be private with auth)
const getOrdersByRestaurant = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (in real app, would be private with auth)
// controllers/orderController.js
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        validStatuses: validStatuses
      });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public (in real app, would be private with auth)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByRestaurant,
  updateOrderStatus,
  deleteOrder
};
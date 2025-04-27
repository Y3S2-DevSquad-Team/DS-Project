// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByRestaurant,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
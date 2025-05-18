const express = require('express');
const authToken = require('../middleware/authToken');
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addOrderToRestaurant,
  completeOrder

} = require('../controllers/RestaurantController.js');

const router = express.Router();

// Restaurant routes
router.post('/', authToken, createRestaurant);
router.get('/', authToken, getRestaurants);
router.get('/:id', authToken, getRestaurant);
router.put('/:id', authToken, updateRestaurant);
router.delete('/:id', authToken, deleteRestaurant);

// Order-related routes
router.post('/:restaurantId/orders/:orderId', authToken, addOrderToRestaurant);
router.post('/:restaurantId/orders/:orderId/complete', authToken, completeOrder);

/*router.get('/:id/orders', getOrderDashboard);
router.put('/:id/orders/:orderId', authToken, updateOrderStatus);*/

module.exports = router;
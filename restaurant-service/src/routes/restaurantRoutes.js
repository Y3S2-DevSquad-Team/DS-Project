const express = require('express');
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
router.post('/', createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

// Order-related routes
router.post('/:restaurantId/orders/:orderId', addOrderToRestaurant);
router.post('/:restaurantId/orders/:orderId/complete', completeOrder);

module.exports = router;
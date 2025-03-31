const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/RestaurantController.js');

const router = express.Router();

// Restaurant routes
router.post('/', createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

module.exports = router;
const express = require('express');
const authToken = require('../middleware/authToken');
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems
} = require('../controllers/MenuItemController.js');

const router = express.Router();

// Menu item routes
router.get('/', getAllMenuItems);
router.post('/', authToken, createMenuItem);
router.get('/restaurant/:restaurantId', getMenuItems);
router.get('/:id', getMenuItem);
router.put('/:id', authToken, updateMenuItem);
router.delete('/:id', authToken, deleteMenuItem);

module.exports = router;
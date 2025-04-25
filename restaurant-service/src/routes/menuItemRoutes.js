const express = require('express');
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/MenuItemController.js');
const upload = require('../utill/fileUpload');


// Menu item routes


router.post('/', upload.single('image'), createMenuItem);
router.put('/:id', upload.single('image'), updateMenuItem);
router.get('/restaurant/:restaurantId', getMenuItems);
router.get('/:id', getMenuItem);

router.delete('/:id', deleteMenuItem);

module.exports = router;
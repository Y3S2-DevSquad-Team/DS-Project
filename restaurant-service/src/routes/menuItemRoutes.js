const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
} = require("../controllers/MenuItemController.js");

const router = express.Router();

// Menu item routes
router.get("/", getAllMenuItems);
router.post("/", createMenuItem);
router.get("/restaurant/:restaurantId", getMenuItems);
router.get("/:id", getMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;

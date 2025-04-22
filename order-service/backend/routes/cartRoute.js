const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

// **Add Item to Cart**
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item is already in the cart
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, name, price, image, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Get Cart Items for a User**
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Remove Item from Cart**
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Clear Entire Cart**
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

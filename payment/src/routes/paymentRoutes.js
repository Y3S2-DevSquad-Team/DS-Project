const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  stripeWebhook,
  getPaymentStatus,
  getAllPayments,
} = require("../controllers/paymentController");

router.post("/initiate", initiatePayment);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.get("/status/:orderId", getPaymentStatus);
router.get("/", getAllPayments);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleCallback,
  getPaymentStatus,
  getAllPayments,
} = require("../controllers/paymentController");

const { initiatePaymentValidator } = require("../validators/paymentValidator");

// Routes

// 1️⃣ Initiate payment
router.post("/initiate", initiatePaymentValidator, initiatePayment);

// 2️⃣ PayHere callback (PayHere POSTs data here after payment)
router.post("/callback", express.urlencoded({ extended: true }), handleCallback);

// 3️⃣ Get status by order ID
router.get("/status/:orderId", getPaymentStatus);

router.get("/all", /* authToken, restrictTo('Admin'), */ getAllPayments);


module.exports = router;

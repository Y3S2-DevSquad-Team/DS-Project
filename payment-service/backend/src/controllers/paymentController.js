const Payment = require("../models/Payment");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { MERCHANT_SECRET } = require("../config/payhereConfig");
const verifySignature = require("../utils/verifySignature");

// 🔐 Future-proof for Auth: req.user.id can replace req.body.userId when Auth is integrated

// 1️⃣ Initiate Payment (redirect user to PayHere)
exports.initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { orderId, userId, amount, first_name, last_name, email, phone, address, city } = req.body;

    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      status: "pending",
    });

    const paymentData = {
      merchant_id: process.env.MERCHANT_ID,
      return_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      notify_url: `${process.env.SERVER_URL}/api/payment/callback`,

      order_id: orderId,
      items: "Delivery Order",
      currency: "LKR",
      amount: amount,

      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      country: "Sri Lanka",
    };

    res.json({
      message: "Redirect to PayHere",
      payhereURL: "https://sandbox.payhere.lk/pay/checkout",
      payload: paymentData,
    });
  } catch (err) {
    console.error("[Error] initiatePayment:", err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

// 2️⃣ Handle PayHere callback
exports.handleCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    const isValid = verifySignature(callbackData, MERCHANT_SECRET);
    if (!isValid) {
      console.warn("[PayHere] Invalid signature detected");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { order_id, payment_id, status_code, payment_method, status_message, card_holder_name, paid_at } = callbackData;

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    payment.status = status_code === "2" ? "success" : status_code === "0" ? "pending" : status_code === "-1" ? "cancelled" : "failed";

    payment.payherePaymentId = payment_id;
    payment.method = payment_method;
    payment.cardHolderName = card_holder_name;
    payment.transactionDate = paid_at || new Date();
    payment.payhereRaw = callbackData;

    await payment.save();
    console.log(`[Payment] Updated status: ${payment.status}`);

    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    console.error("[Error] handleCallback:", err);
    res.status(500).json({ message: "Failed to process callback" });
  }
};

// 3️⃣ Get Payment Status by orderId
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json({
      status: payment.status,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      updatedAt: payment.updatedAt,
    });
  } catch (err) {
    console.error("[Error] getPaymentStatus:", err);
    res.status(500).json({ message: "Failed to retrieve payment status" });
  }
};

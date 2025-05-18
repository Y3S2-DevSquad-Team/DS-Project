const Payment = require("../models/Payment");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { MERCHANT_ID, MERCHANT_SECRET, CLIENT_URL, SERVER_URL, PAYHERE_URL } = require("../config/payhereConfig");
const verifySignature = require("../utils/verifySignature");
const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls");

function generatePayHereHash({ merchant_id, order_id, amount, currency, merchant_secret }) {
  const formattedAmount = parseFloat(amount).toFixed(2); // Always 2 decimals
  const hashedSecret = crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();
  const baseString = merchant_id + order_id + formattedAmount + currency + hashedSecret;
  const hash = crypto.createHash("md5").update(baseString).digest("hex").toUpperCase();
  return hash;
}

exports.handleCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    const isValid = verifySignature(callbackData, MERCHANT_SECRET);
    if (!isValid) {
      console.warn("[PayHere] Invalid signature detected");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { order_id, payment_id, status_code } = callbackData;

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    // ✅ Save full callback payload
    payment.payherePaymentId = payment_id;
    payment.payhereRaw = callbackData;

    // ✅ Map PayHere status_code
    switch (status_code) {
      case "2":
        payment.status = "success";
        break;
      case "0":
        payment.status = "pending";
        break;
      case "-1":
        payment.status = "cancelled";
        break;
      default:
        payment.status = "failed";
    }

    await payment.save();
    console.log(`[Payment] Status updated to: ${payment.status}`);

    // ✅ Retry updating Order status if payment is successful
    if (payment.status === "success") {
      let success = false,
        attempts = 0;
      while (!success && attempts < 3) {
        try {
          await axios.put(`${SERVICE_URLS.ORDER_SERVICE}/${payment.orderId}/status`, {
            status: "processing",
          });
          success = true;
          console.log("[Trigger] Order status updated to 'processing'");
        } catch (err) {
          attempts++;
          console.warn(`[Retry ${attempts}] Failed to update order status:`, err.message);
          await new Promise((r) => setTimeout(r, 1000 * attempts));
        }
      }

      if (!success) {
        console.error("🚨 Failed to notify Order Service after payment. Manual action required.");
      }
    }

    res.status(200).json({ message: "Callback processed successfully" });
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

exports.initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { orderId, userId, amount, first_name, last_name, email, phone, address, city } = req.body;

    // 1️⃣ Create Payment record in DB
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      status: "pending",
    });

    // 2️⃣ Prepare PayHere payload
    const merchant_id = MERCHANT_ID;
    const return_url = `${CLIENT_URL}/payment/success`;
    const cancel_url = `${CLIENT_URL}/payment/cancel`;
    const notify_url = `${SERVER_URL}/api/payment/callback`;
    const items = "Delivery Order";
    const currency = "LKR";
    const country = "Sri Lanka";

    // 3️⃣ Generate HASH for security
    const hash = generatePayHereHash({
      merchant_id,
      order_id: orderId,
      amount,
      currency,
      merchant_secret: MERCHANT_SECRET,
    });

    // 4️⃣ Build payload with hash included
    const paymentData = {
      merchant_id,
      return_url,
      cancel_url,
      notify_url,
      order_id: orderId,
      items,
      currency,
      amount: parseFloat(amount).toFixed(2),
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      country,
      hash, // 🔥 Important: Hash now included
    };

    console.log("[Payment Initiate] PaymentData Sent:", paymentData);

    // 5️⃣ Respond to frontend
    res.status(200).json({
      message: "Redirect to PayHere",
      payhereURL: PAYHERE_URL,
      payload: paymentData,
    });
  } catch (err) {
    console.error("[Error] initiatePayment:", err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

// Admin - Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }); // newest first
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

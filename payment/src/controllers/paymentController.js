const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const axios = require("axios");
const SERVICE_URLS = require("../config/serviceUrls");

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, userId, amount, email } = req.body;

    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      status: "pending",
      currency: "LKR",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "lkr",
          product_data: { name: "Delivery Order" },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        orderId: payment.orderId.toString(),
        paymentId: payment._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe Payment Error]:", err);
    res.status(500).json({ message: "Stripe payment initiation failed", error: err.message });
  }
};

// Stripe webhook endpoint
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature invalid:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const paymentId = session.metadata.paymentId;

    try {
      await Payment.findByIdAndUpdate(paymentId, {
        status: "success",
        method: "card",
        cardHolderName: session.customer_details.name,
        transactionDate: new Date(),
      });

      // Inform order service
      await axios.put(`${SERVICE_URLS.ORDER_SERVICE}/${orderId}/status`, { status: "processing" });
    } catch (err) {
      console.error("Post-payment update failed:", err.message);
    }
  }

  res.status(200).json({ received: true });
};

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
    console.error("getPaymentStatus error:", err);
    res.status(500).json({ message: "Failed to retrieve payment status" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("getAllPayments error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

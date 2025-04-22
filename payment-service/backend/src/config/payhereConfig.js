require("dotenv").config();

module.exports = {
  MERCHANT_ID: process.env.MERCHANT_ID,
  MERCHANT_SECRET: process.env.MERCHANT_SECRET,
  PAYHERE_URL: "https://sandbox.payhere.lk/pay/checkout", // Change in prod
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:4003",
};

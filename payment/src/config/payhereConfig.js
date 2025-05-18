require("dotenv").config();

module.exports = {
  MERCHANT_ID: process.env.MERCHANT_ID || "1229908",
  MERCHANT_SECRET: process.env.MERCHANT_SECRET || "MzM4MjE2NDI0MzQyNTU4MjEzMjAyMTg0MzMwMTA0MTk0NTgxMjIy",
  PAYHERE_URL: "https://sandbox.payhere.lk/pay/checkout", // Change in prod
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:4003",
};

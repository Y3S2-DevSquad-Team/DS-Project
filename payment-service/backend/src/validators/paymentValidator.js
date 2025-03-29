const { check } = require("express-validator");

exports.initiatePaymentValidator = [
  check("orderId").notEmpty().withMessage("Order ID is required"),

  check("userId").notEmpty().withMessage("User ID is required"),

  check("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),

  check("first_name").notEmpty().withMessage("First name is required"),

  check("last_name").notEmpty().withMessage("Last name is required"),

  check("email").isEmail().withMessage("Valid email is required"),

  check("phone").notEmpty().withMessage("Phone number is required"),

  check("address").notEmpty().withMessage("Address is required"),

  check("city").notEmpty().withMessage("City is required"),
];

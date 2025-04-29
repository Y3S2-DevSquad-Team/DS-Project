const { body } = require("express-validator");
const User = require("../models/User");

exports.loginValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be empty")
    .isString()
    .withMessage("Email should be a string")
    .isEmail()
    .withMessage("Email should be a valid email address")
    .normalizeEmail()
    .toLowerCase()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email }).lean();
      if (!user) {
        throw new Error("No account found with this email");
      }
      req.user = user;
      return true;
    }),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isString()
    .withMessage("Password should be a string"),
];

exports.customerSignupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number"),

  body("deliveryAddresses")
    .optional()
    .isArray()
    .withMessage("Delivery addresses must be provided in an array format"),
];

exports.deliverySignupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("vehicleType").notEmpty().withMessage("Vehicle type is required"),

  body("licenseNumber").notEmpty().withMessage("License number is required"),

  body("nic").notEmpty().withMessage("NIC is required"),
];

exports.restaurantSignupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),

  body("location").notEmpty().withMessage("Location is required"),

  body("businessLicenseNumber")
    .notEmpty()
    .withMessage("Business license number is required"),

  body("openingHours.start")
    .optional()
    .isString()
    .withMessage("Opening hours (start) must be a string"),

  body("openingHours.end")
    .optional()
    .isString()
    .withMessage("Opening hours (end) must be a string"),

  body("bankDetails.accountNumber")
    .optional()
    .isString()
    .withMessage("Bank account number must be a string"),

  body("bankDetails.bankName")
    .optional()
    .isString()
    .withMessage("Bank name must be a string"),

  body("bankDetails.branchCode")
    .optional()
    .isString()
    .withMessage("Branch code must be a string"),
];

exports.signupValidator = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username cannot be empty")
    .isString()
    .withMessage("Username should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be empty")
    .isString()
    .withMessage("Email should be a string")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isString()
    .withMessage("Password should be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*())"
    ),

  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password cannot be empty")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Confirm password must match password");
      }
      return true;
    }),

  body("phone")
    .not()
    .isEmpty()
    .withMessage("Phone cannot be empty")
    .isMobilePhone("any")
    .withMessage("Phone should be a valid mobile phone number"),
];

exports.updateUserValidator = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("email")
    .optional()
    .isString()
    .withMessage("Email should be a string")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Phone should be a valid mobile phone number"),
];

exports.getFreshUserAccessTokenValidator = [
  body("refreshToken")
    .not()
    .isEmpty()
    .withMessage("Refresh token cannot be empty")
    .isString()
    .withMessage("Refresh token should be a string"),
];

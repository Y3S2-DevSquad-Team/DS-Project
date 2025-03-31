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
  body("username").notEmpty().isLength({ min: 3 }),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 6 }),
  body("phone").notEmpty().isMobilePhone("any"),
  body("deliveryAddresses").optional().isArray(),
];

exports.deliverySignupValidator = [
  body("username").notEmpty().isLength({ min: 3 }),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 6 }),
  body("phone").notEmpty().isMobilePhone("any"),
  body("vehicleType").notEmpty(),
  body("licenseNumber").notEmpty(),
  body("nic").notEmpty(),
];

exports.restaurantSignupValidator = [
  body("username").notEmpty().isLength({ min: 3 }),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 6 }),
  body("phone").notEmpty().isMobilePhone("any"),
  body("restaurantName").notEmpty(),
  body("location").notEmpty(),
  body("businessLicenseNumber").notEmpty(),
  body("cuisineType").optional(),
  body("openingHours.start").optional(),
  body("openingHours.end").optional(),
  body("bankDetails.accountNumber").optional(),
  body("bankDetails.bankName").optional(),
  body("bankDetails.branchCode").optional(),
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

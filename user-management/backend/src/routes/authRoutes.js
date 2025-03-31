const express = require("express");
const router = express.Router();
const {
  signupCustomer,
  signupDeliveryPerson,
  signupRestaurant,
  loginUser,
  updateUser,
  deleteUser,
  getUserProfile,
} = require("../controllers/authController");
const {
  customerSignupValidator,
  deliverySignupValidator,
  restaurantSignupValidator,
  loginValidator,
  updateUserValidator,
} = require("../validators/authValidator");
const { authToken } = require("../middlewares/token");
const { restrictTo } = require("../middlewares/roleCheck");
const { validate } = require("../utils/utils");

router.post(
  "/signup/customer",
  customerSignupValidator,
  validate,
  signupCustomer
);
router.post(
  "/signup/delivery",
  deliverySignupValidator,
  validate,
  signupDeliveryPerson
);
router.post(
  "/signup/restaurant",
  restaurantSignupValidator,
  validate,
  signupRestaurant
);

router.post("/login", loginValidator, validate, loginUser);

router.get("/", authToken, getUserProfile);

router.put(
  "/",
  authToken,
  restrictTo("User"),
  updateUserValidator,
  validate,
  updateUser
);
router.delete("/", authToken, restrictTo("User"), deleteUser);

module.exports = router;

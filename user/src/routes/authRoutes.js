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
const upload = require("../middlewares/multer");

const { uploadToCloudinary } = require("../config/cloudinary");

router.post("/test-upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    console.log("Local file path:", req.file.path);

    const result = await uploadToCloudinary(req.file.path, {
      folder: "test_uploads",
    });

    return res.status(200).json({
      message: "Upload successful",
      cloudinaryUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post(
  "/signup/customer",
  customerSignupValidator,
  validate,
  signupCustomer
);
router.post(
  "/signup/delivery",
  upload.single("businessCertificate"),
  deliverySignupValidator,
  validate,
  signupDeliveryPerson
);
router.post(
  "/signup/restaurant",
  upload.single("businessCertificate"),
  restaurantSignupValidator,
  (req, res, next) => validate(req, res, next), // <-- this runs the validate() from utils.js
  signupRestaurant // <-- controller
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

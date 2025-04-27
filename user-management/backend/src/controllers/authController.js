const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const handleResponse = require("../utils/response");
const {
  RecordNotFoundError,
  DuplicateRecordsError,
  BadRequestError,
  ValidationFailureError,
  UnauthorizedError,
} = require("../utils/ErrorHandling/CustomErrors.js");
const AppError = require("../utils/ErrorHandling/AppError");
const mongoose = require("mongoose");
const {
  sendWelcomeEmailToCustomer,
  sendWelcomeEmailToDeliveryPerson,
  sendWelcomeEmailToRestaurant,
} = require("../utils/mailer");
const { sendSMS } = require("../services/smsService");
const { deleteLocalFile } = require("../utils/fileHandler");
const { uploadToCloudinary } = require("../config/cloudinary");

const generateTokens = async (user) => {
  const details = {
    _id: user._id,
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.role,
  };

  const accessToken = jwt.sign(details, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(details, process.env.REFRESH_TOKEN_JWT_SECRET, {
    expiresIn: "20y",
  });

  await RefreshToken.deleteOne({ userId: user._id });
  await RefreshToken.create({ userId: user._id, refreshToken });

  return { accessToken, refreshToken };
};

exports.signupUser = async (req, res, next) => {
  const { username, password, email, phone } = req.body;

  try {
    if (!username || !password || !email || !phone) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const checkUser = await User.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (checkUser) {
      return next(
        new DuplicateRecordsError(
          "Email/Phone number is linked to an active account already. Please login"
        )
      );
    }

    const newUser = await User.create({
      username,
      password,
      email,
      phone,
      role: "Customer",
    });

    await sendWelcomeEmail({
      to: newUser.email,
      username: newUser.username,
    });

    const tokens = await generateTokens(newUser);

    return handleResponse(res, 201, "Signup successful", {
      user: details,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(
        new ValidationFailureError("Email and password are required")
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      return next(new RecordNotFoundError("No account found"));
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return next(new BadRequestError("Incorrect password"));
    }

    await User.findOneAndUpdate({ email }, { $set: { loginTime: new Date() } });

    const { accessToken, refreshToken } = await generateTokens(user);

    return handleResponse(res, 200, "Login successful", {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.signupCustomer = async (req, res, next) => {
  try {
    const { username, email, password, phone, deliveryAddresses } = req.body;
    if (!username || !email || !password || !phone) {
      return next(new ValidationFailureError("All fields are required"));
    }
    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists)
      return next(
        new DuplicateRecordsError(
          "User already exists/Email/Phone number is linked to an active account already. Please login"
        )
      );

    const user = await User.create({
      username,
      email,
      password,
      phone,
      role: "Customer",
      deliveryAddresses,
    });

    // await sendWelcomeEmailToCustomer({
    //   to: user.email,
    //   username: user.username,
    // });

    await sendSMS(
      user.phone,
      `Hello, ${user.username}! 🎉 Thanks for signing up with YumGo — your go-to app for quick, delicious, and affordable meals delivered right to your door 🍔🍟`
    );

    const tokens = await generateTokens(user);
    return handleResponse(res, 201, "Customer signed up", { user, ...tokens });
  } catch (error) {
    return next(error);
  }
};

exports.signupDeliveryPerson = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      vehicleType,
      licenseNumber,
      nic,
    } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      !phone ||
      !vehicleType ||
      !licenseNumber ||
      !nic
    ) {
      return next(new ValidationFailureError("All fields are required"));
    }
    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists)
      return next(
        new DuplicateRecordsError(
          "User already exists/Email/Phone number is linked to an active account already. Please login"
        )
      );

    const user = await User.create({
      username,
      email,
      password,
      phone,
      role: "DeliveryPerson",
      vehicleType,
      licenseNumber,
      nic,
    });

    await sendWelcomeEmailToDeliveryPerson({
      to: user.email,
      username: user.username,
    });

    await sendSMS(
      user.phone,
      `Welcome aboard, ${user.username}! 🚀 Thank you for joining the delivery team at YumGo! We are excited to have you onboard. With your help, we are bringing smiles and hot meals to hungry customers across the city. 🚴📦`
    );

    const tokens = await generateTokens(user);
    return handleResponse(res, 201, "Delivery person signed up", {
      user,
      ...tokens,
    });
  } catch (error) {
    return next(error);
  }
};

exports.signupRestaurant = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      restaurantName,
      location,
      businessLicenseNumber,
      cuisineType,
      openingHours,
      bankDetails,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !phone ||
      !restaurantName ||
      !location ||
      !businessLicenseNumber
    ) {
      return next(
        new ValidationFailureError("Required restaurant fields missing")
      );
    }

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists)
      return next(
        new DuplicateRecordsError(
          "User already exists/Email/Phone number is linked to an active account already. Please login"
        )
      );

    const user = await User.create({
      username,
      email,
      password,
      phone,
      role: "Restaurant",
      restaurantName,
      location,
      businessLicenseNumber,
      cuisineType,
      openingHours,
      bankDetails,
      restaurantStatus: "pending",
    });

    await sendWelcomeEmailToRestaurant({
      to: user.email,
      username: user.username,
    });

    await sendSMS(
      user.phone,
      `Welcome, ${user.username}! 👨‍🍳 We are thrilled to have your restaurant join YumGo. Get ready to serve up your delicious dishes to thousands of hungry customers. We shall grow together! 🔥🍔`
    );

    const tokens = await generateTokens(user);
    return handleResponse(res, 201, "Restaurant signed up", {
      user,
      ...tokens,
    });
  } catch (error) {
    return next(error);
  }
};

exports.createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      const newAdmin = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: process.env.ADMIN_PHONE,
        role: "Admin",
      });

      await newAdmin.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { username, email, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phone },
      { new: true }
    );

    return handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return handleResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return next(new PermissionDeniedError("User not found"));
    }

    const response = {
      ...user.toObject(),
    };

    if (user.role === "Restaurant") {
      response.status = user.restaurantStatus || "pending";
    }

    return handleResponse(
      res,
      200,
      "User profile fetched successfully",
      response
    );
  } catch (error) {
    return next(error);
  }
};

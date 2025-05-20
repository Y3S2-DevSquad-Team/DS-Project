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
// const {
//   sendWelcomeEmailToCustomer,
//   sendWelcomeEmailToDeliveryPerson,
//   sendWelcomeEmailToRestaurant,
// } = require("../utils/mailer");
// const { sendSMS } = require("../services/smsService");
const { deleteLocalFile } = require("../utils/fileHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const axios = require("axios");
const {
  sendEmailNotification,
  sendSMSNotification,
} = require("../utils/notification");
const dotenv = require("dotenv");
const APP_NAME = process.env.APP_NAME || "Your Food App";

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

    // await sendWelcomeEmail({
    //   to: newUser.email,
    //   username: newUser.username,
    // });

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

    // await sendSMS(
    //   user.phone,
    //   `Hello, ${user.username}! 🎉 Thanks for signing up with YumGo — your go-to app for quick, delicious, and affordable meals delivered right to your door 🍔🍟`
    // );

    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to ${APP_NAME}</title>
      <style>
        body {
          background-color: #1d1d1d;
          color: #ffffff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 30px;
          background-color: #121212;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #06C167;
          font-size: 28px;
          margin: 0;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
        }
        .button {
          display: inline-block;
          background-color: #06C167;
          color: #000000 !important;
          padding: 12px 24px;
          text-decoration: none !important;
          font-weight: bold;
          font-size: 16px;
          border-radius: 6px;
          margin: 30px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #049B4A;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${APP_NAME}</h1>
        </div>
        <p class="message">Hi ${username},</p>
        <p class="message">
          Thanks for signing up with <strong>${APP_NAME}</strong> — your go-to app for quick, delicious, and affordable meals delivered right to your door.
        </p>
        <div style="text-align: center;">
          <a class="button" href="${
            process.env.REACT_APP_BASE_URL || "#"
          }">Start Exploring</a>
        </div>
        <p class="message">
          If you have questions or feedback, just reply to this email or contact us anytime.
        </p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    await sendEmailNotification(
      user.email,
      `🍽️ Welcome to ${APP_NAME} — Let's get you started!`,
      emailContent
    );

    const smsContent = `Hello, ${user.username}! 🎉 Thanks for signing up with YumGo — your go-to app for quick, delicious, and affordable meals delivered right to your door 🍔🍟`;
    await sendSMSNotification(user.phone, smsContent);

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

    // await sendWelcomeEmailToDeliveryPerson({
    //   to: user.email,
    //   username: user.username,
    // });

    // await sendSMS(
    //   user.phone,
    //   `Welcome aboard, ${user.username}! 🚀 Thank you for joining the delivery team at YumGo! We are excited to have you onboard. With your help, we are bringing smiles and hot meals to hungry customers across the city. 🚴📦`
    // );

    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to ${APP_NAME}</title>
      <style>
        body {
          background-color: #1d1d1d;
          color: #ffffff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 30px;
          background-color: #121212;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #06C167;
          font-size: 28px;
          margin: 0;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
        }
        .button {
          display: inline-block;
          background-color: #06C167;
          color: #000000 !important;
          padding: 12px 24px;
          text-decoration: none !important;
          font-weight: bold;
          font-size: 16px;
          border-radius: 6px;
          margin: 30px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #049B4A;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${APP_NAME}</h1>
        </div>
        <p class="message">Hi ${username},</p>
        <p class="message">
          Thanks for signing up with <strong>${APP_NAME}</strong> — your go-to app for quick, delicious, and affordable meals delivered right to your door.
        </p>
        <div style="text-align: center;">
          <a class="button" href="${
            process.env.REACT_APP_BASE_URL || "#"
          }">Start Exploring</a>
        </div>
        <p class="message">
          If you have questions or feedback, just reply to this email or contact us anytime.
        </p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    await sendEmailNotification(
      user.email,
      `🚴 Welcome to ${APP_NAME} Delivery Team!`,
      emailContent
    );

    const smsContent = `Welcome aboard, ${user.username}! 🚀 Thank you for joining the delivery team at YumGo! With your help, we are bringing smiles and hot meals to hungry customers across the city. 🚴📦`;
    await sendSMSNotification(user.phone, smsContent);

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

    // await sendWelcomeEmailToRestaurant({
    //   to: user.email,
    //   username: user.username,
    // });

    // await sendSMS(
    //   user.phone,
    //   `Welcome, ${user.username}! 👨‍🍳 We are thrilled to have your restaurant join YumGo. Get ready to serve up your delicious dishes to thousands of hungry customers. We shall grow together! 🔥🍔`
    // );

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to ${APP_NAME}</title>
        <style>
          body {
            background-color: #1d1d1d;
            color: #ffffff;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px 30px;
            background-color: #121212;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #06C167;
            font-size: 28px;
            margin: 0;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #e0e0e0;
          }
          .button {
            display: inline-block;
            background-color: #06C167;
            color: #000000 !important;
            padding: 12px 24px;
            text-decoration: none !important;
            font-weight: bold;
            font-size: 16px;
            border-radius: 6px;
            margin: 30px 0;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #049B4A;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${APP_NAME}</h1>
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">
            We’re thrilled to have your restaurant join <strong>${APP_NAME}</strong>. Get ready to serve up your delicious dishes to thousands of hungry customers. Let’s grow together!
          </p>
          <div style="text-align: center;">
            <a class="button" href="${
              process.env.REACT_APP_RESTAURANT_DASHBOARD_URL || "#"
            }">Access Your Restaurant Dashboard</a>
          </div>
          <p class="message">
            Questions or need help getting started? Our support team is just a click away.
          </p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `;
    await sendEmailNotification(
      user.email,
      `"${APP_NAME} Restaurant Support" <${process.env.MAIL_USER}>`,
      emailContent
    );

    const smsContent = `Welcome, ${user.username}! 👨‍🍳 We are thrilled to have your restaurant join YumGo. Get ready to serve up your delicious dishes to thousands of hungry customers. We shall grow together! 🔥🍔`;
    await sendSMSNotification(user.phone, smsContent);

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
  const role = req.user.role;
  const updatePayload = req.body;

  try {
    const allowedFields = {
      Customer: [
        "username",
        "email",
        "phone",
        "profileImage",
        "address",
        "deliveryAddresses",
        "favorites",
        "orderHistory",
        "preferredPaymentMethod",
        "isVerified",
      ],
      DeliveryPerson: [
        "username",
        "email",
        "phone",
        "profileImage",
        "vehicleType",
        "licenseNumber",
        "nic",
        "currentLocation",
        "availability",
        "assignedOrders",
        "deliveryCompletedCount",
      ],
      Restaurant: [
        "username",
        "email",
        "phone",
        "profileImage",
        "restaurantName",
        "location",
        "businessLicenseNumber",
        "cuisineType",
        "openingHours",
        "bankDetails",
        "restaurantStatus",
        "businessCertificateUrl",
      ],
      Admin: ["username", "email", "phone", "profileImage", "address"],
    };

    const filteredUpdate = {};
    const fields = allowedFields[role] || [];

    fields.forEach((key) => {
      if (updatePayload.hasOwnProperty(key)) {
        filteredUpdate[key] = updatePayload[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdate },
      { new: true }
    ).select("-password");

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

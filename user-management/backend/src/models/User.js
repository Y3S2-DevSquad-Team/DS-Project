const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Invalid email format",
      },
      set: (email) => email.toLowerCase().trim(),
      trim: true,
    },
    password: {
      type: String,
      required: true,
      set: (password) => bcrypt.hashSync(password, 10),
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["Customer", "DeliveryPerson", "Restaurant", "Admin"],
      default: "Customer",
    },
    profileImage: String,
    address: String,
    isVerified: Boolean,

    // Restaurant only
    restaurantName: String,
    location: String,
    businessLicenseNumber: String,
    cuisineType: String,
    openingHours: {
      start: String,
      end: String,
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      branchCode: String,
    },
    restaurantStatus: {
      type: String,
      enum: ["rejected", "pending", "registered"],
    },

    // Delivery only
    vehicleType: String,
    licenseNumber: String,
    nic: String,
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    availability: Boolean,
    assignedOrders: [mongoose.Schema.Types.ObjectId],
    deliveryCompletedCount: Number,

    // Customer only
    deliveryAddresses: [
      {
        label: String,
        address: String,
        lat: Number,
        lng: Number,
      },
    ],
    favorites: [mongoose.Schema.Types.ObjectId],
    orderHistory: [mongoose.Schema.Types.ObjectId],
    preferredPaymentMethod: String,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (userPassword, next) {
  try {
    let isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (error) {
    return next(error);
  }
};

userSchema.pre("save", function (next) {
  if (this.role === "Customer") {
    this.restaurantName = undefined;
    this.location = undefined;
    this.businessLicenseNumber = undefined;
    this.cuisineType = undefined;
    this.openingHours = undefined;
    this.bankDetails = undefined;
    this.restaurantStatus = undefined;
    this.vehicleType = undefined;
    this.licenseNumber = undefined;
    this.nic = undefined;
    this.currentLocation = undefined;
    this.availability = undefined;
    this.assignedOrders = undefined;
    this.deliveryCompletedCount = undefined;
  }

  if (this.role === "DeliveryPerson") {
    this.restaurantName = undefined;
    this.location = undefined;
    this.businessLicenseNumber = undefined;
    this.cuisineType = undefined;
    this.openingHours = undefined;
    this.bankDetails = undefined;
    this.restaurantStatus = undefined;
    this.deliveryAddresses = undefined;
    this.favorites = undefined;
    this.orderHistory = undefined;
    this.preferredPaymentMethod = undefined;
  }

  if (this.role === "Restaurant") {
    this.vehicleType = undefined;
    this.licenseNumber = undefined;
    this.nic = undefined;
    this.currentLocation = undefined;
    this.availability = undefined;
    this.assignedOrders = undefined;
    this.deliveryCompletedCount = undefined;
    this.deliveryAddresses = undefined;
    this.favorites = undefined;
    this.orderHistory = undefined;
    this.preferredPaymentMethod = undefined;
  }

  if (this.role === "Admin") {
    this.vehicleType = undefined;
    this.licenseNumber = undefined;
    this.nic = undefined;
    this.currentLocation = undefined;
    this.availability = undefined;
    this.assignedOrders = undefined;
    this.deliveryCompletedCount = undefined;
    this.deliveryAddresses = undefined;
    this.favorites = undefined;
    this.orderHistory = undefined;
    this.preferredPaymentMethod = undefined; 
  }

  next();
});

module.exports = mongoose.model("User", userSchema);

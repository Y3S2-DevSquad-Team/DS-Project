require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4003;

// DB Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for PayHere callback

// Routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("💰 Payment Service is running.");
});

// Error Handling (optional, future)
app.use((err, req, res, next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`[Server] Payment Service running on port ${PORT}`));

module.exports = app; // ✅ useful for testing with Supertest

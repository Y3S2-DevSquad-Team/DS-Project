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
app.use(express.urlencoded({ extended: true }));

// Routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("💰 Payment Service is running.");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ ONLY start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`[Server] Payment Service running on port ${PORT}`));
}

module.exports = app;

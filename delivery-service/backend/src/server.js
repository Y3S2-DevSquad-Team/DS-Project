require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express(); // ✅ This must come first

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/", (req, res) => {
  res.send("🚚 Delivery Management Service is running");
});

// Routes
app.use("/api/delivery", require("./routes/deliveryRoutes"));

// Error middleware should come last ✅
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`[Server] Delivery Service running on port ${PORT}`));

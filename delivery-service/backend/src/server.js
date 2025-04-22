require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const deliveryRoutes = require("./routes/deliveryRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("🚚 Delivery Management Service is running");
});

app.use("/api/delivery", deliveryRoutes);
app.use(errorHandler);

module.exports = app; // ✅ Export Express app

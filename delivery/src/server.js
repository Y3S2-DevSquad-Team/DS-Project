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

app.use("/", deliveryRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`[Server] Delivery Service running on port ${PORT}`);
});


module.exports = app; // ✅ Export Express app

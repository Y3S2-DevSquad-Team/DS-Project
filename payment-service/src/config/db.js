const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("[MongoDB] Connection error:", err.message);

    // Retry logic (optional for resilience)
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

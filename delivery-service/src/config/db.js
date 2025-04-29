const mongoose = require("mongoose");

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("[MongoDB] Connection error:", err.message);

    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

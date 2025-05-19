// server.js
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
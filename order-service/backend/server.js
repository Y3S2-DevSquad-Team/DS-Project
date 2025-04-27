const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const connectDB = require("./config/db.js");


dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Must match your Vite frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
app.use(bodyParser.json());

const orderRoutes = require('./routes/orderRoutes');


app.use('/api/orders', orderRoutes);





connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));

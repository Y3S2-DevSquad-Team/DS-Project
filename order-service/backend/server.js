const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db.js");


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const orderRoutes = require('./routes/orderRoutes');


app.use('/api/orders', orderRoutes);





connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));

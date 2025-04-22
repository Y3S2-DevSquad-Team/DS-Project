const express = require('express');
const mongoose = require('mongoose');
const cartRoutes = require('./routes/cartRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Cart Service Connected to DB'))
    .catch(err => console.log(err));

app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const auth = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

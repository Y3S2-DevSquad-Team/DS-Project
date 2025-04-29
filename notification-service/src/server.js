require("dotenv").config();
const express = require("express");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(express.json());

app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

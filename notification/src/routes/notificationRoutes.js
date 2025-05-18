const express = require("express");
const authToken = require("../middleware/authToken");
const {
  sendEmailNotification,
  sendSMSNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/email", authToken, sendEmailNotification);
router.post("/sms", authToken, sendSMSNotification);

module.exports = router;

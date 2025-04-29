const axios = require("axios");
require("dotenv").config();

const sendEmailNotification = async (to, subject, html) => {
  try {
    await axios.post(
      process.env.NOTIFICATION_SERVICE_URL + "/api/notification/email",
      {
        to,
        subject,
        html,
      }
    );
  } catch (error) {
    console.error(
      "Error sending email via Notification Service:",
      error.message
    );
  }
};

const sendSMSNotification = async (to, message) => {
  try {
    await axios.post(
      process.env.NOTIFICATION_SERVICE_URL + "/api/notification/sms",
      {
        to,
        message,
      }
    );
  } catch (error) {
    console.error("Error sending SMS via Notification Service:", error.message);
  }
};

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
};

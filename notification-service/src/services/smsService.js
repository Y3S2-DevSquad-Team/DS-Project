const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("SMS sent successfully to:", to);
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
    throw error;
  }
};

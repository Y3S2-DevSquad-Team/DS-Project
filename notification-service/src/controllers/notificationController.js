const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

exports.sendEmailNotification = async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const info = await sendEmail({ to, subject, html });
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
};

exports.sendSMSNotification = async (req, res) => {
  const { to, message } = req.body;

  try {
    await sendSMS(to, message);
    res.status(200).json({ message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS" });
  }
};

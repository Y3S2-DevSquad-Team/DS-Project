const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME} Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

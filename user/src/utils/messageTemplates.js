const APP_NAME = process.env.APP_NAME || "Your Food App";

exports.getCustomerWelcomeEmail = (username) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to ${APP_NAME}</title>
      <style>
        body {
          background-color: #1d1d1d;
          color: #ffffff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 30px;
          background-color: #121212;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #06C167;
          font-size: 28px;
          margin: 0;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
        }
        .button {
          display: inline-block;
          background-color: #06C167;
          color: #000000 !important;
          padding: 12px 24px;
          text-decoration: none !important;
          font-weight: bold;
          font-size: 16px;
          border-radius: 6px;
          margin: 30px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #049B4A;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${APP_NAME}</h1>
        </div>
        <p class="message">Hi ${username},</p>
        <p class="message">
          Thanks for signing up with <strong>${APP_NAME}</strong> — your go-to app for quick, delicious, and affordable meals delivered right to your door.
        </p>
        <div style="text-align: center;">
          <a class="button" href="${
            process.env.REACT_APP_BASE_URL || "#"
          }">Start Exploring</a>
        </div>
        <p class="message">
          If you have questions or feedback, just reply to this email or contact us anytime.
        </p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

exports.getCustomerSMS = (username) =>
  `Hello, ${username}! 🎉 Thanks for signing up with ${APP_NAME} — your go-to app for quick, delicious, and affordable meals delivered right to your door 🍔🍟`;

exports.getDeliveryEmail = (username) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to ${APP_NAME}</title>
      <style>
        body {
          background-color: #1d1d1d;
          color: #ffffff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 30px;
          background-color: #121212;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #06C167;
          font-size: 28px;
          margin: 0;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
        }
        .button {
          display: inline-block;
          background-color: #06C167;
          color: #000000 !important;
          padding: 12px 24px;
          text-decoration: none !important;
          font-weight: bold;
          font-size: 16px;
          border-radius: 6px;
          margin: 30px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #049B4A;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${APP_NAME}</h1>
        </div>
        <p class="message">Hi ${username},</p>
        <p class="message">
          Thanks for signing up with <strong>${APP_NAME}</strong> — your go-to app for quick, delicious, and affordable meals delivered right to your door.
        </p>
        <div style="text-align: center;">
          <a class="button" href="${
            process.env.REACT_APP_BASE_URL || "#"
          }">Start Exploring</a>
        </div>
        <p class="message">
          If you have questions or feedback, just reply to this email or contact us anytime.
        </p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

exports.getDeliverySMS = (username) =>
  `Hey ${username}! 🚀 Welcome to the ${APP_NAME} team. Let’s deliver great food and smiles across the city! 📦`;

exports.getRestaurantEmail = (username) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to ${APP_NAME}</title>
        <style>
          body {
            background-color: #1d1d1d;
            color: #ffffff;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px 30px;
            background-color: #121212;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #06C167;
            font-size: 28px;
            margin: 0;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #e0e0e0;
          }
          .button {
            display: inline-block;
            background-color: #06C167;
            color: #000000 !important;
            padding: 12px 24px;
            text-decoration: none !important;
            font-weight: bold;
            font-size: 16px;
            border-radius: 6px;
            margin: 30px 0;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #049B4A;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${APP_NAME}</h1>
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">
            We’re thrilled to have your restaurant join <strong>${APP_NAME}</strong>. Get ready to serve up your delicious dishes to thousands of hungry customers. Let’s grow together!
          </p>
          <div style="text-align: center;">
            <a class="button" href="${
              process.env.REACT_APP_RESTAURANT_DASHBOARD_URL || "#"
            }">Access Your Restaurant Dashboard</a>
          </div>
          <p class="message">
            Questions or need help getting started? Our support team is just a click away.
          </p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `;

exports.getRestaurantSMS = (username) =>
  `Welcome, ${username}! 👨‍🍳 Glad to have your restaurant on ${APP_NAME}. Let’s serve amazing food together! 🍔`;

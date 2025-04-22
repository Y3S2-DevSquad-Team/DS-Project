const SERVICE_URLS = {
  ORDER_SERVICE: process.env.ORDER_SERVICE_URL || "http://localhost:4001/api/orders",
  NOTIFICATION_SERVICE: process.env.NOTIFY_SERVICE_URL || "http://localhost:4004/api/notify",
  AUTH_SERVICE: process.env.AUTH_SERVICE_URL || "http://localhost:4000/api/auth"
};

module.exports = SERVICE_URLS;

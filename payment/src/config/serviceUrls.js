// config/serviceUrls.js

module.exports = {
  AUTH_SERVICE: process.env.AUTH_SERVICE_URL || "http://localhost:4000/api/v1/auth",
  USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:4000/api/v1/auth",
  ORDER_SERVICE: process.env.ORDER_SERVICE_URL || "http://localhost:4001/api/orders",
  DELIVERY_SERVICE: process.env.DELIVERY_SERVICE_URL || "http://localhost:4002/api/delivery",
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE_URL || "http://localhost:4003/api/payment",
  RESTAURANT_SERVICE: process.env.RESTAURANT_SERVICE_URL || "http://localhost:4004/api/restaurants",
  MENU_ITEM_SERVICE: process.env.MENU_ITEM_SERVICE_URL || "http://localhost:4004/api/menu-items",
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4005/api/notification", // (for future use)
};

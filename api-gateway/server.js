require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

// Forward rules
app.use(
  "/api/auth",
  createProxyMiddleware({ target: "http://localhost:4000", changeOrigin: true })
);
app.use(
  "/api/order",
  createProxyMiddleware({ target: "http://localhost:4001", changeOrigin: true })
);
app.use(
  "/api/delivery",
  createProxyMiddleware({ target: "http://localhost:4002", changeOrigin: true })
);
app.use(
  "/api/payment",
  createProxyMiddleware({ target: "http://localhost:4003", changeOrigin: true })
);
app.use(
  "/api/restaurant",
  createProxyMiddleware({ target: "http://localhost:4004", changeOrigin: true })
);
// Proxy /api/auth/* requests to user-service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
  })
);

// Proxy /api/notification/* requests to notification-service
app.use(
  "/api/notification",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/notification": "" },
  })
);

app.get("/", (req, res) => {
  res.send("🚀 API Gateway Running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`[Gateway] Listening on port ${PORT}`));

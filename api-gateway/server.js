require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // allow only your frontend
  credentials: true, // allow cookies / auth headers
};

app.use(cors(corsOptions));

// Request Logger (for easy debugging)
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ AUTH SERVICE (User Management)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:4000", // Auth Service running port
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth",
    },
  })
);

// ✅ ORDER SERVICE
app.use(
  "/api/order",
  createProxyMiddleware({
    target: "http://localhost:4001", // Order Service running port
    changeOrigin: true,
    pathRewrite: {
      "^/api/order": "/api/orders",
    },
  })
);

// ✅ DELIVERY SERVICE
app.use(
  "/api/delivery",
  createProxyMiddleware({
    target: "http://localhost:4002", // Delivery Service running port
    changeOrigin: true,
  })
);

// ✅ PAYMENT SERVICE
app.use(
  "/api/payment",
  createProxyMiddleware({
    target: "http://localhost:4003", // Payment Service running port
    changeOrigin: true,
  })
);

// ✅ RESTAURANT SERVICE
// ✅ RESTAURANT SERVICE
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:4004",
    changeOrigin: true,
  })
);

// ✅ MENU ITEM SERVICE (inside Restaurant Service)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:4004", // Same Restaurant Service
    changeOrigin: true,
  })
);

// Home route
app.get("/", (req, res) => {
  res.send("🚀 API Gateway Running");
});

// Error handler for Gateway
app.use((err, req, res, next) => {
  console.error(`[Gateway Error]:`, err.message);
  res.status(500).json({ error: "Something went wrong in the API Gateway" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[Gateway] Listening on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Your frontend
  credentials: true,
};

app.use(cors(corsOptions));

// Request Logger
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

/* ----------------------------- SERVICE ROUTES ----------------------------- */

// ✅ AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
  })
);

// ✅ ORDER SERVICE
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true,
  })
);

// ✅ DELIVERY SERVICE
app.use(
  "/api/delivery",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
  })
);

// ✅ PAYMENT SERVICE
app.use(
  "/api/payment",
  createProxyMiddleware({
    target: "http://localhost:4003",
    changeOrigin: true,
  })
);

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

// ✅ NOTIFICATION SERVICE
app.use(
  "/api/notification",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
  })
);

/* ----------------------------- DEFAULT ROUTES ----------------------------- */

app.get("/", (req, res) => {
  res.send("🚀 API Gateway Running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[Gateway Error]:`, err.message);
  res.status(500).json({ error: "Something went wrong in the API Gateway" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[Gateway] Listening on port ${PORT}`);
});

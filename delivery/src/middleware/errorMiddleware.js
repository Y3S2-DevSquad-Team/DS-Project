const errorHandler = (err, req, res, next) => {
  console.error("[Unhandled Error]", err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    success: false
  });
};

module.exports = errorHandler;

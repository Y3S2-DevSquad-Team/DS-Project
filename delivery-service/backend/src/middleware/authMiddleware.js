const { authToken } = require("user-service/middleware/token");
const { restrictTo } = require("user-service/middleware/roleCheck");



const mockAuth = (role = null) => {
  return (req, res, next) => {
    // Simulate extracted user info
    req.user = {
      id: "mock-user-id-123",
      role: "delivery", // or "customer"
    };

    if (role && req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Role not allowed" });
    }

    next();
  };
};

module.exports = mockAuth;

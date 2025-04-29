import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    // 🚪 No token = Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // ❌ Wrong role = Unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // ✅ Allowed
};

export default ProtectedRoute;

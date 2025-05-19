import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

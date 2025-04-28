import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, List, LogIn, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole"); // 🆕 Assuming you store user role at login
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const getProfilePath = () => {
    if (!userRole) return "/login";
    if (userRole === "Customer") return "/customer/profile";
    if (userRole === "DeliveryPerson") return "/delivery-person/profile";
    if (userRole === "Restaurant") return "/restaurant/profile";
    return "/";
  };

  return (
    <motion.nav 
      className="fixed top-0 z-50 w-full bg-white shadow-md"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          YumGo
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          
          <Link to="/orders" className="flex items-center gap-1 text-gray-700 hover:text-green-500">
            <List size={20} />
            <span className="hidden sm:inline">Orders</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-green-500">
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link to={getProfilePath()} className="flex items-center gap-1 text-gray-700 hover:text-green-500">
                <User size={20} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-500"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/Register" className="flex items-center gap-1 text-gray-700 hover:text-green-500">
              <LogIn size={20} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;

import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  List,
  LogIn,
  LogOut,
  Truck,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserRole(role);
    setMenuOpen(false); // close menu on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const getProfilePath = () => {
    switch (userRole) {
      case "Customer":
        return "/customer/profile";
      case "DeliveryPerson":
        return "/driver/profile";
      case "Restaurant":
        return "/restaurant/profile";
      case "Admin":
        return "/admin/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full bg-white border-b shadow-md"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          YumGo
        </Link>

        {/* Hamburger (mobile only) */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>

        {/* NAV LINKS */}
        <div
          className={`flex-col sm:flex-row sm:flex items-center gap-4 absolute sm:static bg-white left-0 w-full sm:w-auto sm:bg-transparent px-4 py-3 sm:p-0 shadow-md sm:shadow-none transition-all duration-300 ease-in-out ${
            menuOpen ? "top-16 flex" : "hidden sm:flex"
          }`}
        >
          {isLoggedIn && (
            <>
              {/* Customer */}
              {userRole === "Customer" && (
                <>
                  <Link
                    to="/customer/my-orders"
                    className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                  >
                    <List size={20} />
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                  >
                    <ShoppingCart size={20} />
                    Cart
                  </Link>
                </>
              )}

              {/* DeliveryPerson */}
              {userRole === "DeliveryPerson" && (
                <Link
                  to="/driver/my-deliveries"
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                >
                  <Truck size={20} />
                  My Deliveries
                </Link>
              )}

              {/* Restaurant */}
              {userRole === "Restaurant" && (
                <>
                  <Link
                    to="/restaurant/orders"
                    className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                  >
                    <List size={20} />
                    Manage Orders
                  </Link>
                  <Link
                    to="/restaurant/menu"
                    className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                  >
                    🍽 Menu Items
                  </Link>
                </>
              )}

              {/* Admin (optional) */}
              {userRole === "Admin" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                >
                  📊 Dashboard
                </Link>
              )}
            </>
          )}

          {/* Auth Links */}
          {isLoggedIn ? (
            <>
              <Link
                to={getProfilePath()}
                className="flex items-center gap-1 text-gray-700 hover:text-green-600"
              >
                <User size={20} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="flex items-center gap-1 text-gray-700 hover:text-green-600"
            >
              <LogIn size={20} />
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

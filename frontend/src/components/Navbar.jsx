import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Cart", path: "/cart", icon: "🛒" },
    { name: "Profile", path: "/profile", icon: "👤" }, // can be used later
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50 sm:static sm:flex sm:justify-between sm:items-center sm:px-6 sm:py-3 sm:bg-secondary sm:text-white">
      <div className="hidden sm:block text-2xl font-bold text-primary">Uber Eats</div>

      <ul className="flex justify-around sm:justify-end w-full sm:w-auto">
        {navItems.map((item) => (
          <motion.li
            key={item.name}
            whileTap={{ scale: 0.9 }}
            className={`flex flex-col items-center p-3 text-sm sm:mx-3 ${
              location.pathname === item.path ? "text-primary font-semibold" : "text-gray-500 sm:text-white"
            }`}
          >
            <Link to={item.path}>
              <div className="text-xl">{item.icon}</div>
              <span className="sm:hidden">{item.name}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}

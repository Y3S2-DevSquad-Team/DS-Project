import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

const ProfileSidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser); // Fetch the user
  const userRole = currentUser?.role; // Extract the role

  // Function to determine profile path based on user role
  const getProfilePath = () => {
    if (!userRole) return "/"; // fallback
    if (userRole === "Customer") return "/customer/profile";
    if (userRole === "DeliveryPerson") return "/delivery-person/profile";
    if (userRole === "Restaurant") return "/restaurant/profile";
    return "/"; // fallback
  };

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "My Profile", icon: <FaUser />, path: getProfilePath() }, // Dynamic path here
    { label: "My Orders", icon: <FaClipboardList />, path: "/orders" },
    { label: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="w-64 bg-[#0f0f0f] text-white flex flex-col py-8 px-4 border-r border-gray-800 fixed top-0 left-0 h-screen justify-between">
      {/* Logo Section */}
      <div>
        <div className="text-center text-3xl font-bold mb-10 text-[#06C167]">
          YumGo
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-[#2a2a2a] cursor-pointer transition"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center text-white font-semibold p-3 rounded-md bg-gradient-to-l from-red-600 to-red-700 hover:opacity-90 transition"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;

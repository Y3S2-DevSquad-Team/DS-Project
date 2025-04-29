import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaHome, FaClipboardList, FaCog } from "react-icons/fa";

const ProfileSidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const userRole = currentUser?.role;

  // Determine profile path based on user role
  const getProfilePath = () => {
    if (!userRole) return "/";
    if (userRole === "Customer") return "/customer/profile";
    if (userRole === "DeliveryPerson") return "/delivery-person/profile";
    if (userRole === "Restaurant") return "/restaurant/profile";
    return "/";
  };

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "My Profile", icon: <FaUser />, path: getProfilePath() },
    { label: "My Orders", icon: <FaClipboardList />, path: "/orders" },
    { label: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className='flex flex-col justify-between w-64 min-h-screen px-4 py-8 text-gray-800 bg-white border-r border-gray-200 shadow-md'>
      {/* Logo */}
      <div>
        <div className='mb-10 text-3xl font-bold text-center text-green-600'>YumGo</div>

        {/* Menu */}
        <nav className='flex flex-col gap-4'>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className='flex items-center gap-3 p-3 transition rounded-md cursor-pointer hover:bg-green-100'
              onClick={() => navigate(item.path)}>
              {item.icon}
              <span className='font-semibold'>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          className='flex items-center justify-center w-full gap-2 p-3 font-semibold text-white transition bg-red-500 rounded-md hover:bg-red-600'>
          <FaSignOutAlt className='text-xl' />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;

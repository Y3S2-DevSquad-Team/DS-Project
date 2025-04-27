import {
  FaUserPlus,
  FaMotorcycle,
  FaUtensils,
  FaSignInAlt,
} from "react-icons/fa";

const Sidebar = ({ onSelectRole }) => {
  return (
    <div className="w-64 min-h-screen bg-[#0f0f0f] text-white flex flex-col p-6 shadow-lg justify-between">
      {/* Logo and Main Buttons Section */}
      <div>
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#06C167]">YumGo</h1>
          <p className="text-gray-400 text-sm">Delivery Partner App</p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-6">
          <button
            onClick={() => onSelectRole("Customer")}
            className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition"
          >
            <FaUserPlus className="text-[#06C167] text-xl" />
            Customer Sign Up
          </button>
          <button
            onClick={() => onSelectRole("DeliveryPerson")}
            className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition"
          >
            <FaMotorcycle className="text-[#06C167] text-xl" />
            Delivery Sign Up
          </button>
          <button
            onClick={() => onSelectRole("Restaurant")}
            className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition"
          >
            <FaUtensils className="text-[#06C167] text-xl" />
            Restaurant Sign Up
          </button>
        </div>
      </div>

      {/* Already have account section */}
      <div className="mt-10">
        <p className="text-gray-400 text-sm mb-2 text-center">Already have an account?</p>
        <button
          onClick={() => onSelectRole("Login")}
          className="flex items-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition justify-center"
        >
          <FaSignInAlt className="text-[#06C167] text-xl" />
          Login
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
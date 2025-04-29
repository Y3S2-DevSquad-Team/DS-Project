import { FaUserPlus, FaMotorcycle, FaUtensils, FaSignInAlt } from "react-icons/fa";

const Sidebar = ({ onSelectRole }) => {
  return (
    <div className='flex flex-col justify-between w-64 min-h-screen px-4 py-8 text-gray-800 bg-white border-r border-gray-200 shadow-md'>
      {/* Logo Section */}
      <div>
        <div className='mb-10 text-center'>
          <h1 className='text-3xl font-bold text-green-600'>YumGo</h1>
          <p className='text-sm text-gray-500'>Delivery Partner App</p>
        </div>

        {/* Menu Buttons */}
        <div className='flex flex-col gap-6'>
          <button
            onClick={() => onSelectRole("Customer")}
            className='flex items-center gap-3 px-5 py-3 font-semibold text-gray-800 transition bg-gray-100 rounded-md hover:bg-green-100'>
            <FaUserPlus className='text-xl text-green-500' />
            Customer Sign Up
          </button>
          <button
            onClick={() => onSelectRole("DeliveryPerson")}
            className='flex items-center gap-3 px-5 py-3 font-semibold text-gray-800 transition bg-gray-100 rounded-md hover:bg-green-100'>
            <FaMotorcycle className='text-xl text-green-500' />
            Delivery Sign Up
          </button>
          <button
            onClick={() => onSelectRole("Restaurant")}
            className='flex items-center gap-3 px-5 py-3 font-semibold text-gray-800 transition bg-gray-100 rounded-md hover:bg-green-100'>
            <FaUtensils className='text-xl text-green-500' />
            Restaurant Sign Up
          </button>
        </div>
      </div>

      {/* Already have account section */}
      <div className='mt-10'>
        <p className='mb-2 text-sm text-center text-gray-500'>Already have an account?</p>
        <button
          onClick={() => onSelectRole("Login")}
          className='flex items-center justify-center w-full gap-3 px-5 py-3 font-semibold text-gray-800 transition bg-gray-100 rounded-md hover:bg-green-100'>
          <FaSignInAlt className='text-xl text-green-500' />
          Login
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

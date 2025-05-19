import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          YumGo
        </Link>
        
        <nav className="flex items-center space-x-6">
          {/* Customer Pages */}
        
          <Link to="/menu" className="text-gray-700 hover:text-green-600 transition-colors">
            Menus
          </Link>
          <Link to="/restaurants" className="text-gray-700 hover:text-green-600 transition-colors">
            Restaurants
          </Link>
          
          {/* Admin Pages */}
          <div className="relative">
            <button 
              className="text-gray-700 hover:text-green-600 transition-colors flex items-center"
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
            >
              Admin
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAdminDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                onClick={() => setShowAdminDropdown(false)}
              >
                <Link to="/admin/restaurants" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Manage Restaurants
                </Link>
                <Link to="/admin/menus" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Manage Menus
                </Link>
                <Link to="/admin/restaurants/add" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Add Restaurant
                </Link>
                <Link to="/admin/menus/add" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Add Menu Item
                </Link>
                <Link 
                  to="/admin/restaurants/1/orders" // Using "1" as a temporary restaurant ID
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Order Management
                </Link>
              </div>
            )}
          </div>
        
        </nav>
      </div>
    </header>
  );
};

export default Header;
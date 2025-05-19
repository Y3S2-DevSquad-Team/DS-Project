import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuCard from '../components/Restaurant/MenuCard';
import { FiClock, FiPhone, FiMapPin, FiStar, FiChevronLeft, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const RestaurantMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // You would calculate this based on opening hours

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          fetch(`http://localhost:8080/api/restaurants/${id}`),
          fetch(`http://localhost:8080/api/menu-items/restaurant/${id}`)
        ]);
        
        const restaurantData = await restaurantRes.json();
        const menuData = await menuRes.json();
        
        setRestaurant(restaurantData);
        setMenuItems(menuData);
        // Calculate if restaurant is open based on current time and opening hours
        setIsOpen(checkIfOpen(restaurantData.openingHours));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Helper function to check if restaurant is open
  const checkIfOpen = (openingHours) => {
    if (!openingHours) return true;
    // Implement your logic to check current time against opening hours
    return true; // Default to open if we can't determine
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would also update the favorite status in your backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 animate-pulse">Loading menu...</div>
          </div>
        ) : restaurant && (
          <>
            {/* Enhanced Restaurant Header Section */}
            <div className="container px-4 pt-6 mx-auto md:px-6">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center mb-4 text-green-600 transition-colors hover:text-green-700"
              >
                <FiChevronLeft className="w-5 h-5 mr-1" />
                Back to Restaurants
              </button>
              
              {/* Vibrant Restaurant Card */}
              <div className="relative mb-6 overflow-hidden shadow-lg rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <div className="p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="mb-2 text-3xl font-bold md:text-4xl drop-shadow-md">
                        {restaurant.name}
                      </h1>
                      <div className="flex items-center mb-4">
                        {renderRatingStars(4.5)}
                        <span className="mx-3 text-white/70">•</span>
                        <span className="text-lg text-white/90">{restaurant.category || 'Various Cuisine'}</span>
                        <span className="mx-3 text-white/70">•</span>
                        <span className="text-white/90">LKR</span>
                      </div>
                    </div>
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={toggleFavorite}
                      className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/30"
                    >
                      {isFavorite ? (
                        <FaHeart className="w-6 h-6 text-red-500" />
                      ) : (
                        <FiHeart className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center mt-4">
                    <div className={`flex items-center px-3 py-1 rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm font-medium">
                        {isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                    {isOpen && (
                      <span className="ml-3 text-sm text-white/90">
                        Closes at {restaurant.openingHours?.split('-')[1] || '10 PM'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 opacity-10">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0ZM100 180C56 180 20 144 20 100C20 56 56 20 100 20C144 20 180 56 180 100C180 144 144 180 100 180Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Restaurant Details Section */}
            <div className="container px-4 mx-auto md:px-6">
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                {/* About Section */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                  <h2 className="flex items-center mb-4 text-xl font-semibold">
                    <FiMapPin className="w-5 h-5 mr-2 text-green-500" />
                    About
                  </h2>
                  <p className="mb-4 text-gray-600">
                    {restaurant.description || 'No description available'}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FiMapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium text-gray-700">Address</h3>
                        <p className="text-gray-600">{restaurant.address || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiClock className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium text-gray-700">Opening Hours</h3>
                        <p className="text-gray-600">{restaurant.openingHours || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                  <h2 className="flex items-center mb-4 text-xl font-semibold">
                    <FiPhone className="w-5 h-5 mr-2 text-green-500" />
                    Contact
                  </h2>
                  <div className="flex items-start mb-4">
                    <FiPhone className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-700">Phone</h3>
                      <p className="text-gray-600">{restaurant.contactNumber || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium text-gray-700">Availability</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(restaurant.availability || {}).map(([day, isAvailable]) => (
                        <span 
                          key={day}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Restaurant Info Section */}
                <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                  <h2 className="mb-4 text-xl font-semibold">Restaurant Info</h2>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-green-50">
                      <h3 className="text-sm text-gray-500">Delivery Time</h3>
                      <p className="font-medium text-green-700">30-45 min</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <h3 className="text-sm text-gray-500">Delivery Fee</h3>
                      <p className="font-medium text-blue-700">LKR. 200</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50">
                      <h3 className="text-sm text-gray-500">Minimum Order</h3>
                      <p className="font-medium text-purple-700">LKR. 1000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Navigation Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'menu' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'info' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Info
                  </button>
                </nav>
              </div>

              {/* Menu Items */}
              {activeTab === 'menu' && (
                <>
                  {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
                    <div key={category} className="mb-12">
                      <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => (
                          <MenuCard key={item._id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">Customer Reviews</h2>
                  <p className="text-gray-500">Reviews feature coming soon!</p>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">Additional Information</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium text-gray-700">Payment Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">Cash</span>
                        <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">Credit Card</span>
                        <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">Debit Card</span>
                        <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">Mobile Payment</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium text-gray-700">Cuisines</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
                          {restaurant.category || 'Various'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RestaurantMenuPage;
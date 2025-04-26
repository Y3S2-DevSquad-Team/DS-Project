import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuCard from '../components/restaurant/MenuCard';
import { FiClock, FiPhone, FiMapPin, FiStar, FiChevronLeft } from 'react-icons/fi';

const RestaurantMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          fetch(`http://localhost:5001/api/restaurants/${id}`),
          fetch(`http://localhost:5001/api/menu-items/restaurant/${id}`)
        ]);
        
        const restaurantData = await restaurantRes.json();
        const menuData = await menuRes.json();
        
        setRestaurant(restaurantData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-500">Loading menu...</div>
          </div>
        ) : restaurant && (
          <>
            {/* Restaurant Header - Removed ash color background */}
            <div className="container mx-auto px-4 md:px-6 pt-6">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-green-600 mb-4"
              >
                <FiChevronLeft className="w-5 h-5 mr-1" />
                Back to Restaurants
              </button>
              
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
                  <div className="flex items-center mt-2">
                    {renderRatingStars(4.5)}
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{restaurant.category || 'Various Cuisine'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Details Section - Inline layout */}
            <div className="container mx-auto px-4 md:px-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* About Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-600 mb-4">
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact</h2>
                  <div className="flex items-start mb-4">
                    <FiPhone className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-700">Phone</h3>
                      <p className="text-gray-600">{restaurant.contactNumber || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                  <h3 className="font-medium text-gray-700 mb-2">Availability</h3>
<div className="flex gap-2 mt-1 flex-wrap">
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Restaurant Info</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-500">Delivery Time</h3>
                      <p className="font-medium">30-45 min</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Delivery Fee</h3>
                      <p className="font-medium">Rs. 200</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Minimum Order</h3>
                      <p className="font-medium">Rs. 1000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Navigation Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'menu' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
                      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                  <p className="text-gray-500">Reviews feature coming soon!</p>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Payment Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Cash</span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Credit Card</span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Debit Card</span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Mobile Payment</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Cuisines</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Function to generate random rating between 3.0 and 5.0
  const generateRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1);
  };

  // Function to generate random review count between 10 and 500
  const generateRandomReviewCount = () => {
    return Math.floor(Math.random() * 490) + 10;
  };

  // Function to generate a random delivery time between 15-60 minutes
  const generateRandomDeliveryTime = () => {
    return Math.floor(Math.random() * 45) + 15;
  };

  // Function to generate a random delivery fee in LKR
  const generateRandomDeliveryFee = () => {
    const fee = Math.floor(Math.random() * 100) + 2; // Between LKR 50-350
    return fee < 100 ? "Free for first km" : `LKR ${fee} for first km`;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/restaurants");
        const data = await response.json();

        // Add random ratings and other details to each restaurant
        const restaurantsWithDetails = data.map((restaurant, index) => ({
          ...restaurant,
          image: `/images/restaurant/${(index % 10) + 1}.jpg`,
          rating: generateRandomRating(),
          reviewCount: generateRandomReviewCount(),
          deliveryTime: generateRandomDeliveryTime(),
          deliveryFee: generateRandomDeliveryFee(),
          isFavorite: Math.random() > 0.7, // 30% chance to be favorite
        }));

        setRestaurants(restaurantsWithDetails);
        setFilteredRestaurants(restaurantsWithDetails);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  // Function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}

        {hasHalfStar && (
          <svg key='half' className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
            <defs>
              <linearGradient id='half-star' x1='0' x2='100%' y1='0' y2='0'>
                <stop offset='50%' stopColor='currentColor' />
                <stop offset='50%' stopColor='#D1D5DB' />
              </linearGradient>
            </defs>
            <path
              fill='url(#half-star)'
              d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
            />
          </svg>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className='w-4 h-4 text-gray-300' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </>
    );
  };

  return (
    <div className='flex flex-col min-h-screen bg-opacity-0 bg-gray-50'>
      <main className='container flex-grow px-4 py-8 mx-auto mt-20'>
        <h1 className='mb-2 text-3xl font-bold text-center text-gray-800'>Discover Restaurants</h1>
        <p className='mb-8 text-center text-gray-500'>Find your favorite dining spots</p>

        {/* Search Bar */}
        <div className='relative max-w-md mx-auto mb-12'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search restaurants...'
              className='w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className='absolute right-4 top-3.5 h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500 animate-pulse'>Loading restaurants...</div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className='py-12 text-center'>
            <svg className='w-12 h-12 mx-auto text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='mt-2 text-lg font-medium text-gray-900'>No restaurants found</h3>
            <p className='mt-1 text-gray-500'>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className='overflow-hidden transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1'>
                <div className='p-6'>
                  <img src={restaurant.image} alt={restaurant.name} className='object-cover w-full h-40 rounded-t-xl' />
                  <div className='flex items-start justify-between mb-4'>
                    

                    <div>
                      <h2 className='text-xl font-bold text-gray-800'>{restaurant.name}</h2>
                      <p className='text-sm text-gray-500'>{restaurant.category || "Various Cuisine"}</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {restaurant.isFavorite && (
                        <div className='p-1 text-red-500'>
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      )}
                      <div className='flex items-center px-2 py-1 bg-green-100 rounded-full'>
                        <span className='text-sm font-medium text-green-800'>{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <div className='flex items-center mb-3'>
                      <div className='flex mr-2'>{renderStars(parseFloat(restaurant.rating))}</div>
                      <span className='text-sm text-gray-600'>({restaurant.reviewCount}+ reviews)</span>
                    </div>

                    <p className='mb-3 text-gray-600 line-clamp-2'>
                      {restaurant.description || "Delicious food and great service await you at this restaurant."}
                    </p>

                    <div className='flex items-center mb-3 space-x-4 text-sm text-gray-500'>
                      <div className='flex items-center'>
                        <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {restaurant.deliveryTime} min
                      </div>
                      <div className='flex items-center'>
                        <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                          />
                        </svg>
                        {restaurant.deliveryFee}
                      </div>
                    </div>

                    <p className='text-sm text-gray-600'>
                      <span className='font-medium'>Open:</span> {restaurant.openingHours || "10:00 AM - 10:00 PM"}
                    </p>
                  </div>

                  <div className='flex items-center justify-between'>
                    <button
                      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                      className='flex items-center px-6 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700'>
                      View Menu
                      <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                      </svg>
                    </button>
                    <button className='p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantListPage;

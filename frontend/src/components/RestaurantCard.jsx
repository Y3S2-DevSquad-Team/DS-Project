const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Restaurant Image */}
      <div className="relative h-48 w-full">
        <img 
          src={restaurant.imageUrl || 'https://source.unsplash.com/random/400x300/?restaurant,food'} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          ⏱️ {restaurant.deliveryTime} min
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[var(--color-dark)] truncate max-w-[70%]">
            {restaurant.name}
          </h3>
          <span className="bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full">
            {restaurant.rating} ★
          </span>
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span>{restaurant.cuisine}</span>
          <span className="mx-2">•</span>
          <span>${restaurant.deliveryFee} delivery</span>
        </div>

        <button className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-2 rounded-md transition-colors">
          View Menu
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
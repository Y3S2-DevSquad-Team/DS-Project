import RestaurantCard from './RestaurantCard';

const RestaurantList = ({ restaurants }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
        Popular Restaurants Near You
      </h2>
      
      {restaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No restaurants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
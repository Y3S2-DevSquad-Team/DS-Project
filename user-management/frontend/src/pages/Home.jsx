import CategoryScroller from "../components/CategoryScroller";
import RestaurantCard from "../components/RestaurantCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const sampleRestaurants = [
    {
      id: 1,
      name: "Green Leaf Vegan",
      image: "/images/vegan.jpg",
      rating: 4.8,
      deliveryTime: "25-30 min",
    },
    {
      id: 2,
      name: "Pizza Hub",
      image: "/images/pizza.jpg",
      rating: 4.5,
      deliveryTime: "15-20 min",
    },
    {
      id: 3,
      name: "Burger Bliss",
      image: "/images/burger.jpg",
      rating: 4.7,
      deliveryTime: "20-25 min",
    },
  ];

  return (
    <div className="p-4">
      <SearchBar />
      <CategoryScroller />

      <h2 className="text-xl font-semibold text-white my-4">Featured Restaurants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

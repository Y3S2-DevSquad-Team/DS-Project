import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import api from "../../services/api"; // Your Axios instance

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/api/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RestaurantList;

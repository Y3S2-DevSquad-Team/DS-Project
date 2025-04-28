import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Axios instance
import MenuItemCard from "../../components/Restaurant/MenuItemCard";
import { motion } from "framer-motion";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
        localStorage.setItem("restaurantId", id);
        localStorage.setItem("restaurantName", res.data.name);

        console.log("Restaurant ID:", id);
        console.log("Restaurant Name:", res.data.name);
      } catch (error) {
        console.error("Failed to fetch restaurant", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await api.get(`/api/menu-items/restaurant/${id}`);
        setMenuItems(res.data);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      }
    };

    fetchRestaurant();
    fetchMenuItems();
  }, [id]);

  if (!restaurant) {
    return <div className='mt-10 text-center text-gray-800'>Loading...</div>;
  }

  return (
    <div className='min-h-screen px-4 py-8 bg-gray-100'>
      {/* Restaurant Info */}
      <motion.div className='max-w-5xl mx-auto mb-10' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className='text-3xl font-bold text-green-600'>{restaurant.name}</h1>
        <p className='text-gray-600'>{restaurant.address}</p>
        <p className='mt-1 text-gray-500'>{restaurant.cuisineType || "Various Cuisines"}</p>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        className='grid max-w-5xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        {menuItems.map((item) => (
          <MenuItemCard key={item._id} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default RestaurantDetails;

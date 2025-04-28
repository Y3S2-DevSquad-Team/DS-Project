import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RestaurantCard = ({ restaurant }) => {
  return (
    <motion.div className='flex flex-col p-4 transition bg-white shadow-md rounded-xl hover:shadow-lg' whileHover={{ scale: 1.03 }}>
      <Link to={`/restaurant/${restaurant._id}`} className='flex flex-col h-full'>
        {/* Placeholder Image */}
        <div className='h-40 mb-4 bg-gray-200 rounded-md'></div>

        {/* Restaurant Info */}
        <h3 className='text-lg font-semibold text-gray-800'>{restaurant.name}</h3>
        <p className='mt-1 text-sm text-gray-500'>{restaurant.address}</p>
        <p className='mt-1 text-sm text-gray-500'>{restaurant.cuisineType || "Various Cuisines"}</p>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;

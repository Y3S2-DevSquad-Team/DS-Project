import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RestaurantCard = ({ restaurant }) => {
  return (
    <motion.div 
      className="transition-all bg-white shadow rounded-xl hover:shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className="h-40 bg-gray-200 rounded-t-xl"></div> {/* Image Placeholder */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{restaurant.name}</h2>
          <p className="text-sm text-gray-500">{restaurant.address}</p>
          <p className="mt-1 text-sm text-gray-500">{restaurant.openingHours}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;

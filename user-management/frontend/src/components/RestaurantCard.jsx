import { motion } from "framer-motion";

export default function RestaurantCard({ restaurant }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white text-secondary rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform"
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        <p className="text-sm text-gray-600">⭐ {restaurant.rating}</p>
        <p className="text-sm text-gray-500">{restaurant.deliveryTime}</p>
      </div>
    </motion.div>
  );
}

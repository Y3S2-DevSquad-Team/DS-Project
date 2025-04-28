import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      className="flex flex-col p-4 transition bg-white shadow-md rounded-xl hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
    >
      {/* Placeholder Image */}
      <div className="h-32 mb-4 bg-gray-200 rounded-md"></div>

      {/* Item Info */}
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
      <div className="flex items-center justify-between pt-4 mt-auto">
        <span className="text-lg font-bold text-green-600">
          Rs {item.price}
        </span>
        <button
          onClick={() => {
            console.log("Adding item:", item);
            addToCart(item);
          }}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;

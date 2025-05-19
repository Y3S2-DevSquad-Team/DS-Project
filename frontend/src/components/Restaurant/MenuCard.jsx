import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";

const MenuCard = ({ item }) => {
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Seafood: "🦞",
      Biryani: "🍛",
      Pasta: "🍝",
      Dessert: "🍰",
      Burgers: "🍔",
      Pizza: "🍕",
      Sushi: "🍣",
      Drinks: "🥤",
    };
    return emojiMap[category] || "🍽️";
  };

  const { addToCart } = useCart();
  const imageUrl = item.imageFilename ? `/images/menu-items/${item.imageFilename}` : null;

  return (
    <div className='flex flex-col h-full overflow-hidden transition-shadow bg-white border rounded-lg hover:shadow-md'>
      <div className='flex items-center justify-center h-48 overflow-hidden bg-gray-100'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className='object-cover w-full h-full'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
              e.target.parentElement.innerHTML = `
                <div class="text-center p-4">
                  <span class="text-5xl">${getCategoryEmoji(item.category)}</span>
                  <p class="text-gray-500 mt-2">Image not found</p>
                </div>
              `;
            }}
          />
        ) : (
          <div className='p-4 text-center'>
            <span className='text-5xl'>{getCategoryEmoji(item.category)}</span>
            <p className='mt-2 text-gray-500'>No image</p>
          </div>
        )}
      </div>
      <div className='flex flex-col flex-grow p-4'>
        <h4 className='font-bold text-gray-800'>{item.name}</h4>
        <p className='flex-grow mt-1 text-sm text-gray-600'>{item.description || "No description available"}</p>
        <div className='flex items-center justify-between mt-3'>
          <span className='font-bold text-gray-800'>LKR. {item.price.toLocaleString()}</span>
          <button
            onClick={() => {
              console.log("Adding item:", item);
              toast.success("Item added to cart!");
              addToCart(item);
            }}
            className='px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded hover:bg-green-700'>
            Add +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

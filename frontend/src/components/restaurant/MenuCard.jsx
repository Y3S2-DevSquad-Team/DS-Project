import React from 'react';

const MenuCard = ({ item }) => {
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Seafood': '🦞',
      'Biryani': '🍛',
      'Pasta': '🍝',
      'Dessert': '🍰',
      'Burgers': '🍔',
      'Pizza': '🍕',
      'Sushi': '🍣',
      'Drinks': '🥤'
    };
    return emojiMap[category] || '🍽️';
  };

  const imageUrl = item.imageFilename 
    ? `/images/menu-items/${item.imageFilename}`
    : null;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white h-full flex flex-col">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              e.target.parentElement.innerHTML = `
                <div class="text-center p-4">
                  <span class="text-5xl">${getCategoryEmoji(item.category)}</span>
                  <p class="text-gray-500 mt-2">Image not found</p>
                </div>
              `;
            }}
          />
        ) : (
          <div className="text-center p-4">
            <span className="text-5xl">{getCategoryEmoji(item.category)}</span>
            <p className="text-gray-500 mt-2">No image</p>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h4 className="font-bold text-gray-800">{item.name}</h4>
        <p className="text-gray-600 text-sm mt-1 flex-grow">
          {item.description || 'No description available'}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-gray-800">
            Rs. {item.price.toLocaleString()}
          </span>
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
            Add +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
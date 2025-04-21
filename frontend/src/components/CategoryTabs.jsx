import { useState } from 'react';

const CategoryTabs = () => {
  const categories = [
    { id: 1, name: 'All', icon: '🍽️' },
    { id: 2, name: 'Burgers', icon: '🍔' },
    { id: 3, name: 'Pizza', icon: '🍕' },
    { id: 4, name: 'Sushi', icon: '🍣' },
    { id: 5, name: 'Salads', icon: '🥗' },
    { id: 6, name: 'Desserts', icon: '🍰' },
  ];

  const [activeCategory, setActiveCategory] = useState(1);

  return (
    <div className="flex space-x-2 overflow-x-auto py-4 px-4 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex items-center space-x-1 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            activeCategory === category.id
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
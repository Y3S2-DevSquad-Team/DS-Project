import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext'; // Adjust path as needed

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Mock data - Replace this with real API call later
  useEffect(() => {
    const mockMenus = [
      {
        
       
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce and mozzarella",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
      },
      {
        
       
        name: "Chicken Burger",
        description: "Juicy chicken patty with lettuce and mayo",
        price: 8.99,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      },
      {
       
        name: "Chocolate Cake",
        description: "Rich chocolate dessert",
        price: 5.99,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
      },
      {
       
        name: "Caesar Salad",
        description: "Fresh greens with Caesar dressing",
        price: 7.99,
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=60",
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setMenus(mockMenus);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading menus...</div>;
  if (!menus.length) return <div className="p-4 text-center">No menu items available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Menu Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{menu.name}</h2>
              <p className="text-gray-600 mt-2">{menu.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold">${menu.price.toFixed(2)}</p>
                <button
  onClick={() => {
    console.log("Adding to cart:", menu); // Debug log
    addToCart(menu);
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  Add to Cart
</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage; 
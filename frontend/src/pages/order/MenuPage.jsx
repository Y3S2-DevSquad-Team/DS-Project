import React, { useEffect, useState } from "react";
import { useCart } from "../../components/order/CartContext"; // Correct context path

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const mockMenus = [
      {
        id: "menu1",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce and mozzarella",
        price: 1200,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: "menu2",
        name: "Chicken Burger",
        description: "Juicy chicken patty with lettuce and mayo",
        price: 900,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: "menu3",
        name: "Chocolate Cake",
        description: "Rich chocolate dessert",
        price: 600,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: "menu4",
        name: "Caesar Salad",
        description: "Fresh greens with Caesar dressing",
        price: 750,
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=60",
      },
    ];

    setTimeout(() => {
      setMenus(mockMenus);
      setLoading(false);
    }, 500); // Simulated API delay
  }, []);

  if (loading) return <div className='p-4 text-center'>Loading menu items...</div>;
  if (!menus.length) return <div className='p-4 text-center'>No menu items available</div>;

  return (
    <div className='min-h-screen p-4 text-gray-900 bg-gray-100'>
      <h1 className='mb-6 text-2xl font-bold'>Menu</h1>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {menus.map((menu) => (
          <div key={menu.id} className='overflow-hidden transition-shadow bg-white rounded-lg shadow hover:shadow-lg'>
            <img src={menu.imageUrl} alt={menu.name} className='object-cover w-full h-48' />
            <div className='p-4'>
              <h2 className='text-xl font-semibold'>{menu.name}</h2>
              <p className='mt-2 text-gray-600'>{menu.description}</p>
              <div className='flex items-center justify-between mt-4'>
                <p className='text-lg font-bold'>Rs. {menu.price.toFixed(2)}</p>
                <button onClick={() => addToCart(menu)} className='px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/Restaurant/MenuCard";
import { FiClock, FiPhone, FiMapPin, FiStar, FiChevronLeft, FiSearch } from "react-icons/fi";

const UserMenu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("menu");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/menu-items");
        const data = await response.json();
        console.log("Fetched menu items:", data); // Debug log
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories from menu items
  const getUniqueCategories = () => {
    const categories = new Set(menuItems.map((item) => item.category.toLowerCase()));
    return ["all", ...Array.from(categories)];
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.category.toLowerCase();
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  const filteredItems = menuItems.filter((item) => {
    // Search filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const groupedItems = groupByCategory(filteredItems);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-grow'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500 animate-pulse'>Loading menu...</div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className='container px-4 pt-6 mx-auto md:px-6'>
              <button onClick={() => navigate(-1)} className='flex items-center mb-4 text-green-600 transition-colors hover:text-green-700'>
                <FiChevronLeft className='w-5 h-5 mr-1' />
                Back
              </button>

              <div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                <h1 className='mb-4 text-3xl font-bold text-gray-800'>All Menu Items</h1>

                {/* Search and Filter Section */}
                <div className='flex flex-col gap-4 mb-6 md:flex-row'>
                  <div className='relative flex-grow'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <FiSearch className='text-gray-400' />
                    </div>
                    <input
                      type='text'
                      placeholder='Search menu items...'
                      className='w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className='flex items-center gap-2'>
                    <label htmlFor='category-filter' className='font-medium text-gray-700'>
                      Filter:
                    </label>
                    <select
                      id='category-filter'
                      className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}>
                      {getUniqueCategories().map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/restaurants")}
                  className='flex items-center px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700'>
                  View Restaurants
                </button>
              </div>
            </div>

            {/* Menu Items */}
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className='container px-4 mx-auto mb-12 md:px-6'>
                <h2 className='pb-2 mb-4 text-xl font-semibold text-gray-800 border-b'>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {items.map((item) => (
                    <MenuCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && !loading && (
              <div className='container px-4 mx-auto md:px-6'>
                <div className='py-12 text-center bg-white rounded-lg shadow-sm'>
                  <p className='text-lg text-gray-500'>No menu items found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className='mt-4 text-green-600 hover:text-green-700'>
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserMenu;

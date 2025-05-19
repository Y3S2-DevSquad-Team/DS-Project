import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await fetch(`http://localhost:8080/api/restaurants/${id}`, {
          method: 'DELETE'
        });
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center sm:mb-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Restaurants Management</h1>
          <Link 
            to="/admin/restaurants/add" 
            className="w-full px-4 py-2 text-center text-white transition duration-300 bg-green-600 rounded-lg shadow-md sm:w-auto hover:bg-green-700"
          >
            Add New Restaurant
          </Link>
        </div>

        {loading ? (
          <div className="p-4 bg-white rounded shadow sm:p-6">Loading restaurants...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">NAME</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">ADDRESS</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">CONTACT</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">MENU SECTION</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 sm:px-6 whitespace-nowrap">
                      {restaurant.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 sm:px-6 whitespace-nowrap">
                      {restaurant.address}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 sm:px-6 whitespace-nowrap">
                      {restaurant.contactNumber}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                        <Link
                          to={`/restaurants/${restaurant._id}`}
                          className="px-3 py-1 text-sm font-medium text-center text-blue-800 transition duration-300 bg-blue-100 rounded-lg shadow-sm hover:bg-blue-200"
                        >
                          View 
                        </Link>
                        <Link
                         to="/admin/menus/add"
                          className="px-3 py-1 text-sm font-medium text-center text-green-800 transition duration-300 bg-green-100 rounded-lg shadow-sm hover:bg-green-200"
                        >
                          Add 
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                        <Link
                          to={`/admin/restaurants/${restaurant._id}/edit`}
                          className="px-3 py-1 text-sm font-medium text-center text-yellow-800 transition duration-300 bg-yellow-100 rounded-lg shadow-sm hover:bg-yellow-200"
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => handleDelete(restaurant._id)}
                          className="px-3 py-1 text-sm font-medium text-center text-red-800 transition duration-300 bg-red-100 rounded-lg shadow-sm hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;
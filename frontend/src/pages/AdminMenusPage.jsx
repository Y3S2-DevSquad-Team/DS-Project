import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminMenusPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/menu-items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await fetch(`http://localhost:8080/api/menu-items/${id}`, {
          method: 'DELETE'
        });
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Menu Items Management</h1>
          <Link 
            to="/admin/menus/add" 
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Add New Menu Item
          </Link>
        </div>

        {loading ? (
          <div className="p-6 bg-white rounded shadow">Loading menu items...</div>
        ) : (
          <div className="overflow-hidden bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Restaurant</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">LKR. {item.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.restaurantId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
  <div className="flex space-x-2">
    <Link
      to={`/admin/menus/${item._id}/edit`}
      className="px-3 py-1 text-sm font-medium text-yellow-800 transition duration-300 bg-yellow-100 rounded-lg shadow-sm hover:bg-yellow-200"
    >
      Update
    </Link>
    <button
      onClick={() => handleDelete(item._id)}
      className="px-3 py-1 text-sm font-medium text-red-800 transition duration-300 bg-red-100 rounded-lg shadow-sm hover:bg-red-200"
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

export default AdminMenusPage;
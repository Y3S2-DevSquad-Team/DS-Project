import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminMenusPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/menu-items');
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
        await fetch(`http://localhost:5001/api/menu-items/${id}`, {
          method: 'DELETE'
        });
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Menu Items Management</h1>
          <Link 
            to="/admin/menus/add" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add New Menu Item
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded shadow">Loading menu items...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">LKR. {item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.restaurantId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <div className="flex space-x-2">
    <Link
      to={`/admin/menus/${item._id}/edit`}
      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium shadow-sm transition duration-300"
    >
      Update
    </Link>
    <button
      onClick={() => handleDelete(item._id)}
      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-medium shadow-sm transition duration-300"
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
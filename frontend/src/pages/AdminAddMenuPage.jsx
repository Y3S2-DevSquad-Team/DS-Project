import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AdminAddMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: '',
    imageFilename: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/restaurants/');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();

    if (isEditMode) {
      const fetchMenuItem = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/menu-items/${id}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching menu item:', error);
        }
      };
      fetchMenuItem();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/menu-items/${id}`
        : 'http://localhost:8080/api/menu-items';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/menus');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 text-green-600 hover:text-green-800"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h1>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Price (Rs.)*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Restaurant*</label>
                <select
                  name="restaurantId"
                  value={formData.restaurantId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Image Filename</label>
                <input
                  type="text"
                  name="imageFilename"
                  value={formData.imageFilename}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="e.g., burger.jpg"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  {isEditMode ? 'Update Menu Item' : 'Add Menu Item'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddMenuPage;
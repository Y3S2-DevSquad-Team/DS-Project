import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AdminAddRestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    openingHours: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchRestaurant = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/restaurants/${id}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching restaurant:', error);
        }
      };
      fetchRestaurant();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/restaurants/${id}`
        : 'http://localhost:8080/api/restaurants';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/restaurants');
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
            {isEditMode ? 'Edit Restaurant' : 'Add New Restaurant'}
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
                  <label className="block mb-1 text-sm font-medium text-gray-700">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Contact Number*</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Opening Hours*</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Availability</label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.keys(formData.availability).map(day => (
                    <div key={day} className="flex flex-col items-center">
                      <span className="mb-1 text-xs">{day.substring(0, 3)}</span>
                      <button
                        type="button"
                        onClick={() => handleAvailabilityChange(day)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.availability[day] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {formData.availability[day] ? '✓' : '✗'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  {isEditMode ? 'Update Restaurant' : 'Add Restaurant'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddRestaurantPage;
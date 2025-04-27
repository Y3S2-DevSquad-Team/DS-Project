import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Mock API call (replace with your actual endpoint later)
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data?.orders || []);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link 
              to={`/orders/${order.id}`} 
              key={order.id}
              className="block hover:no-underline"
            >
              <div className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition">
                <div className="flex justify-between">
                  <span className="font-medium">Order #{order.id}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p>No orders found.</p>
          <Link 
            to="/" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
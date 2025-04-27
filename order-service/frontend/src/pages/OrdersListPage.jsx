import React, { useState, useEffect } from 'react';

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, you would filter by current user
        const response = await fetch('/api/orders/user/user123'); // Replace with actual user ID
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold">Order #{order._id.slice(-6)}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">{order.restaurantName}</p>
                <p className="text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}

                </p>
              </div>
              
              <a 
                href={`/orders/${order._id}`} 
                className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersListPage;
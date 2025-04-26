import React, { useState } from 'react';

const AdminOrderManagement = () => {
  // Mock data with useState so we can update the status
  const [orders, setOrders] = useState([
    { id: '1', items: [{ name: 'Burger', quantity: 2 }], status: 'pending', createdAt: new Date() },
    { id: '2', items: [{ name: 'Pizza', quantity: 1 }, { name: 'Salad', quantity: 1 }], status: 'pending', createdAt: new Date() },
    { id: '3', items: [{ name: 'Pasta', quantity: 1 }], status: 'pending', createdAt: new Date() },
  ]);

  // Function to handle order status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        
        <div className="bg-white rounded shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-6 border-b">Pending Orders</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-900">
                      {order.items.map((item, i) => (
                        <li key={i}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center text-sm text-gray-500">
            Note: This is mock data. Will connect to backend when services are integrated.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;

































/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminOrderManagement = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/restaurants/${id}/orders`);
        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/restaurants/${id}/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status })
        }
      );
      const updatedData = await response.json();
      setRestaurant(updatedData);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Capacity</h2>
          <div className="flex items-center justify-between">
            <div>
              <p>Current Orders: {restaurant.currentOrderCount}</p>
              <p>Order Limit: {restaurant.orderLimit}</p>
            </div>
            <div className={`px-4 py-2 rounded ${
              restaurant.currentOrderCount >= restaurant.orderLimit 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {restaurant.currentOrderCount >= restaurant.orderLimit 
                ? 'At Capacity' 
                : 'Accepting Orders'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-6 border-b">Pending Orders</h2>
          {restaurant.pendingOrders.length === 0 ? (
            <p className="p-6 text-gray-500">No pending orders</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurant.pendingOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm text-gray-900">
                        {order.items.map((item, i) => (
                          <li key={i}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(order.orderId, 'accepted')}
                            disabled={restaurant.currentOrderCount >= restaurant.orderLimit}
                            className={`px-3 py-1 rounded ${
                              restaurant.currentOrderCount >= restaurant.orderLimit
                                ? 'bg-gray-200 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.orderId, 'rejected')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement; */
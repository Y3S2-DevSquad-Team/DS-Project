import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderStatusPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) throw new Error('Order not found');
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading order...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    delivered: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order #{order._id.slice(-6)}</h1>
      
      <div className="mb-6">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status.toUpperCase()}
        </div>
        <p className="mt-2 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="font-bold">Items</h2>
        {order.items.map(item => (
          <div key={item.menuItemId} className="flex justify-between py-2 border-b">
            <span>{item.itemName} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
        <div>
          <p className="font-medium">Delivery Address:</p>
          <p className="text-gray-600">{order.deliveryAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;

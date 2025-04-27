import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderStatusPage = () => {
  const { id } = useParams(); // orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/order/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order:", err.message);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className='p-4 text-center'>Loading order details...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;
  if (!order) return <div className='p-4'>Order not found</div>;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-purple-100 text-purple-800",
  };

  return (
    <div className='max-w-2xl min-h-screen p-6 mx-auto text-gray-900 bg-gray-100'>
      <h1 className='mb-6 text-2xl font-bold'>Order #{order._id.slice(-6)}</h1>

      <div className='mb-6'>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
          {order.status.toUpperCase()}
        </div>
        <p className='mt-2 text-sm text-gray-600'>Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className='mb-8 space-y-4'>
        <h2 className='text-lg font-bold'>Items Ordered</h2>
        {order.items.map((item) => (
          <div key={item.productId} className='flex justify-between py-2 border-b'>
            <span>
              {item.itemName} × {item.quantity}
            </span>
            <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between text-lg font-bold'>
          <span>Total:</span>
          <span>Rs. {order.totalAmount.toFixed(2)}</span>
        </div>

        <div className='mt-4'>
          <h2 className='font-bold'>Delivery Address:</h2>
          <p className='text-gray-700'>{order.deliveryAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "dummyUserId"; // Load from login or fallback

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/order/user/${userId}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <div className='p-4 text-center'>Loading orders...</div>;
  if (error) return <div className='p-4 text-center text-red-500'>{error}</div>;

  return (
    <div className='min-h-screen p-4 text-gray-900 bg-gray-100'>
      <h1 className='mb-6 text-2xl font-bold'>Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div key={order._id} className='p-4 transition bg-white rounded-lg shadow hover:shadow-md'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='font-bold'>Order #{order._id.slice(-6)}</h2>
                  <p className='text-sm text-gray-500'>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {order.status}
                </span>
              </div>

              <div className='mt-3'>
                <p className='font-medium'>{order.restaurantName || "Unknown Restaurant"}</p>
                <p className='text-gray-600'>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} • Rs. {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className='inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800'>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersListPage;

// src/pages/customer/MyOrdersPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // Assuming Customer's ID is stored at login

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/order/api/order/user/${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700">Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center text-green-600">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order._id} className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-2 text-lg font-bold text-gray-800">Order ID: {order._id}</h2>
              <p className="text-gray-600">Restaurant: {order.restaurantName}</p>
              <p className="text-gray-600">Status: <span className="font-semibold">{order.status}</span></p>
              <p className="text-gray-600">Total: Rs {order.totalAmount.toFixed(2)}</p>

              <button
                onClick={() => navigate(`/customer/track-order/${order._id}`)}
                className="w-full py-2 mt-4 font-semibold text-white transition bg-green-500 rounded-md hover:bg-green-600">
                Track Delivery
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/customer/OrderDetailsPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/order/api/order/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700">Loading order details...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Order not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center text-green-600">Order Details</h1>

      <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Order ID: {order._id}</h2>
        <p className="mb-2 text-gray-700">Restaurant: {order.restaurantName}</p>
        <p className="mb-2 text-gray-700">Status: {order.status}</p>
        <p className="mb-2 text-gray-700">Delivery Address: {order.deliveryAddress}</p>
        <p className="mb-6 font-semibold text-gray-700">Total: Rs {order.totalAmount.toFixed(2)}</p>

        <h3 className="mb-4 text-lg font-bold text-gray-800">Items:</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="p-4 rounded-md bg-gray-50">
              <h4 className="font-bold text-md">{item.itemName}</h4>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: Rs {item.price}</p>
            </div>
          ))}
        </div>

        {/* Go Back button */}
        <button
          onClick={() => navigate("/customer/my-orders")}
          className="w-full py-2 mt-6 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
}

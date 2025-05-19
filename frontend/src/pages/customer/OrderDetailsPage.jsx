import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("Resolving location...");
  const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
        const data = res.data;
        setOrder(data);

        const coords = `${data.deliveryCoords?.lat},${data.deliveryCoords?.lng}`;
        if (coords && data.deliveryCoords?.lat && data.deliveryCoords?.lng) {
          const geoRes = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${GEOCODING_API_KEY}`
          );
          const addr = geoRes.data.results?.[0]?.formatted_address || coords;
          setAddress(addr);
        } else {
          setAddress("Location: Not Available");
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setAddress("Failed to resolve location");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700 animate-pulse">Loading order details...</h2>
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
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-center text-green-600">Order Details</h1>

      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-700">Restaurant:</h2>
          <p className="text-gray-800">{order.restaurantName}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Ordered On:</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status:</p>
            <p className="font-semibold capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount:</p>
            <p className="font-semibold text-gray-800">Rs. {order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Delivery Address:</p>
            <p className="text-gray-700">{address}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">Ordered Items:</h3>
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 rounded-md bg-gray-50"
              >
                <span className="font-medium">{item.quantity} × {item.itemName}</span>
                <span className="text-sm text-gray-600">Rs. {item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate("/customer/my-orders")}
          className="w-full py-3 font-semibold text-white transition bg-green-600 rounded-md hover:bg-green-700"
        >
          ← Back to My Orders
        </button>
      </div>
    </div>
  );
}

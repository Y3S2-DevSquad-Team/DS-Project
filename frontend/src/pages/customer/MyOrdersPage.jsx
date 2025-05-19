import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [addresses, setAddresses] = useState({});

  const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
        const fetchedOrders = res.data || [];
        setOrders(fetchedOrders);

        const newAddresses = {};
        for (const order of fetchedOrders) {
          const key = `${order.deliveryCoords?.lat},${order.deliveryCoords?.lng}`;
          if (key && !newAddresses[key]) {
            const geoRes = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${key}&key=${GEOCODING_API_KEY}`
            );
            newAddresses[key] = geoRes.data.results?.[0]?.formatted_address || key;
          }
        }
        setAddresses(newAddresses);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userId]);

  const filteredOrders = orders
    .filter((o) => o.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((o) =>
      dateFilter ? new Date(o.createdAt).toISOString().slice(0, 10) === dateFilter : true
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700 animate-pulse">Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-center text-green-600">My Orders</h1>

      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Search by restaurant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md md:w-1/2"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No matching orders found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => {
            const key = `${order.deliveryCoords?.lat},${order.deliveryCoords?.lng}`;
            const address = addresses[key] || "Location: Not Available";

            return (
              <li
                key={order._id}
                className="flex flex-col p-5 space-y-2 bg-white border rounded-md shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    {order.restaurantName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* <p className="text-sm text-gray-600">Order ID: {order._id}</p> */}
                <p className="text-sm text-gray-600">Status: <strong>{order.status}</strong></p>
                <p className="text-sm text-gray-600">Total: Rs. {order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Delivery Address: {address}</p>

                <button
                  onClick={() => navigate(`/customer/track-order/${order._id}`)}
                  className="w-full py-2 font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Track Delivery
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

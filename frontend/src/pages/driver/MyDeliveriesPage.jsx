import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // Format: yyyy-mm-dd
  const [locationAddresses, setLocationAddresses] = useState({});

  const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const driverId = localStorage.getItem("userId");

useEffect(() => {
  const fetchMyDeliveries = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/delivery/driver/${driverId}`);
      const deliveriesData = res.data.deliveries || [];
      setDeliveries(deliveriesData);

      // Resolve readable addresses
      const addresses = {};
      for (const delivery of deliveriesData) {
        const locKey = `${delivery.customerLocation.lat},${delivery.customerLocation.lng}`;
        if (!addresses[locKey]) {
          const geoRes = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locKey}&key=${GEOCODING_API_KEY}`
          );
          const address = geoRes.data.results?.[0]?.formatted_address || locKey;
          addresses[locKey] = address;
        }
      }
      setLocationAddresses(addresses);

    } catch (error) {
      console.error("Failed to fetch your deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchMyDeliveries();
}, [driverId]);


  const handleUpdateStatus = async (deliveryId, newStatus) => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            await axios.patch(`http://localhost:8080/api/delivery/update/${deliveryId}`, {
              status: newStatus,
              lat,
              lng,
            });

            toast.success(`Delivery marked as ${newStatus}`);
            window.location.reload();
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast.error("Failed to fetch your location. Please enable GPS and try again.");
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Failed to update delivery status:", error);
      toast.error("Failed to update delivery. Please try again.");
    }
  };

  // 🔍 Filtering Logic
  const filteredDeliveries = deliveries
    .filter((d) => statusFilter === "all" || d.status === statusFilter)
    .filter((d) => d.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((d) => (dateFilter ? new Date(d.createdAt).toISOString().slice(0, 10) === dateFilter : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 🆕 Sort newest first

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-700 animate-pulse'>Loading your deliveries...</h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-4 py-8 bg-gray-50'>
      <h1 className='mb-6 text-3xl font-bold text-center text-green-600'>My Deliveries</h1>

      <div className='flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-1 gap-2'>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='px-4 py-2 border border-gray-300 rounded-md'>
            <option value='all'>All Statuses</option>
            <option value='assigned'>Assigned</option>
            <option value='picked'>Picked</option>
            <option value='delivered'>Delivered</option>
            <option value='cancelled'>Cancelled</option>
          </select>

          <input
            type='date'
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-md'
          />
        </div>

        <input
          type='text'
          placeholder='Search by restaurant...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-md md:w-1/2'
        />
      </div>

      {filteredDeliveries.length === 0 ? (
        <p className='text-center text-gray-600'>No matching deliveries found.</p>
      ) : (
        <ul className='space-y-4'>
          {filteredDeliveries.map((delivery) => {
  const locKey = `${delivery.customerLocation.lat},${delivery.customerLocation.lng}`;
  const readableAddress = locationAddresses[locKey] || `${delivery.customerLocation.lat}, ${delivery.customerLocation.lng}`;

  return (
    <li key={delivery._id} className="flex flex-col p-5 space-y-2 bg-white border rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{delivery.restaurantName}</h2>
        <span className="text-sm text-gray-500">{new Date(delivery.createdAt).toLocaleString()}</span>
      </div>

      <p className="text-sm text-gray-600">Location: {readableAddress}</p>

      <p className="text-sm text-gray-600">
        Status: <strong>{delivery.status}</strong>
      </p>

      <ul className="text-sm text-gray-700 list-disc list-inside">
        {delivery.items.map((item, i) => (
          <li key={i}>
            {item.quantity} × {item.itemName} – Rs. {item.price}
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-2">
        {delivery.status === "assigned" && (
          <button
            onClick={() => handleUpdateStatus(delivery._id, "picked")}
            className="flex-1 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Mark as Picked
          </button>
        )}
        {delivery.status === "picked" && (
          <button
            onClick={() => handleUpdateStatus(delivery._id, "delivered")}
            className="flex-1 py-2 font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Mark as Delivered
          </button>
        )}
      </div>
    </li>
  );
})}

        </ul>
      )}
    </div>
  );
}

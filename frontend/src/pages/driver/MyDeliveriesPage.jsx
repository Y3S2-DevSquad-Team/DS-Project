// src/pages/driver/MyDeliveriesPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const driverId = localStorage.getItem("userId"); // Driver's ID stored after login

  useEffect(() => {
    const fetchMyDeliveries = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/delivery/api/delivery/driver/${driverId}`);
        setDeliveries(res.data.deliveries || []);
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
      // ✅ Try to get driver's live location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
  
          await axios.patch(`http://localhost:8080/api/delivery/api/delivery/update/${deliveryId}`, {
            status: newStatus,
            lat,
            lng,
          });
  
          alert(`Delivery marked as ${newStatus}`);
          window.location.reload();
        }, (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to fetch your location. Please enable GPS and try again.");
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Failed to update delivery status:", error);
      alert("Failed to update delivery. Please try again.");
    }
  };
  

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-700'>Loading your deliveries...</h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <h1 className='mb-8 text-3xl font-bold text-center text-green-600'>My Deliveries</h1>

      {deliveries.length === 0 ? (
        <p className='text-center text-gray-600'>You have no deliveries assigned yet.</p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {deliveries.map((delivery) => (
            <div key={delivery._id} className='p-6 bg-white rounded-lg shadow-md'>
              <h2 className='mb-2 text-lg font-bold text-gray-800'>Delivery ID: {delivery._id}</h2>
              <p className='text-gray-600'>
                Location: {delivery.customerLocation.lat}, {delivery.customerLocation.lng}
              </p>
              <p className='mb-2 text-gray-600'>Status: {delivery.status}</p>

              {/* Update Status Buttons */}
              {delivery.status === "assigned" && (
                <button
                  onClick={() => handleUpdateStatus(delivery._id, "picked")}
                  className='w-full py-2 mt-2 font-semibold text-white transition bg-blue-500 rounded-md hover:bg-blue-600'>
                  Mark as Picked
                </button>
              )}

              {delivery.status === "picked" && (
                <button
                  onClick={() => handleUpdateStatus(delivery._id, "delivered")}
                  className='w-full py-2 mt-2 font-semibold text-white transition bg-green-500 rounded-md hover:bg-green-600'>
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

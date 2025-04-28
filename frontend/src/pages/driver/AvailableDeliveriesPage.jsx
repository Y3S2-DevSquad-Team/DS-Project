import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AvailableDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDeliveries = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/delivery/api/delivery/available");
        setDeliveries(res.data);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDeliveries();
  }, []);

  const handleAccept = async (deliveryId) => {
    try {
      const driverId = localStorage.getItem("userId"); // ✅ Get logged in user's ID
  
      await axios.patch(
        `http://localhost:8080/api/delivery/api/delivery/accept/${deliveryId}`,
        { driverId }, // ✅ Send driverId inside body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      alert("Delivery accepted successfully!");
      navigate("/driver/my-deliveries");
    } catch (error) {
      console.error("Failed to accept delivery:", error);
      alert("Failed to accept delivery. Please try again.");
    }
  };
  
  

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-700'>Loading available deliveries...</h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <h1 className='mb-8 text-3xl font-bold text-center text-green-600'>Available Deliveries</h1>

      {deliveries.length === 0 ? (
        <p className='text-center text-gray-600'>No deliveries available at the moment.</p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {deliveries.map((delivery) => (
            <div key={delivery._id} className='p-6 bg-white rounded-lg shadow-md'>
              <h2 className='mb-2 text-lg font-bold text-gray-800'>Delivery ID: {delivery._id}</h2>
              <p className='text-gray-600'>
                Location: {delivery.customerLocation.lat}, {delivery.customerLocation.lng}
              </p>
              <p className='text-gray-600'>Status: {delivery.status}</p>

              <button
                onClick={() => handleAccept(delivery._id)}
                className='w-full py-2 mt-4 font-semibold text-white transition bg-green-500 rounded-md hover:bg-green-600'>
                Accept Delivery
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

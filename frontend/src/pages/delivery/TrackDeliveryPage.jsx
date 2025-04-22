import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TrackDeliveryPage() {
  const { orderId } = useParams();
  const [status, setStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/api/delivery/status/${orderId}`);
        setStatus(res.data.status);
        setDriverLocation(res.data.driverLocation);
      } catch (err) {
        console.error("Error fetching delivery status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus(); // Initial call
    interval = setInterval(fetchStatus, 5000); // Poll every 5 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, [orderId]);

  return (
    <div className="min-h-screen p-6 bg-secondary text-white">
      <h1 className="text-2xl font-bold mb-4 text-primary">Track Delivery</h1>

      {loading ? (
        <p className="text-sm text-gray-300">Loading status...</p>
      ) : (
        <div className="bg-white p-5 rounded-lg text-secondary shadow-md space-y-4">
          <p><span className="font-medium">Order ID:</span> {orderId}</p>
          <p><span className="font-medium">Status:</span> {status}</p>
          <p><span className="font-medium">Driver Location:</span></p>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">Latitude: {driverLocation?.lat}</p>
            <p className="text-sm">Longitude: {driverLocation?.lng}</p>
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-primary text-white py-2 rounded hover:bg-green-600 transition"
              onClick={() => window.location.reload()}
            >
              Refresh Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DriverDeliveriesPage() {
  const { driverId } = useParams();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/api/delivery/driver/${driverId}`);
        setDeliveries(res.data.deliveries || []);
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [driverId]);

  return (
    <div className="min-h-screen p-6 bg-secondary text-white">
      <h1 className="text-2xl font-bold text-primary mb-6">Assigned Deliveries</h1>

      {loading ? (
        <p>Loading deliveries...</p>
      ) : deliveries.length === 0 ? (
        <p>No deliveries assigned.</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery._id} className="bg-white text-secondary p-4 rounded shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">Order: {delivery.orderId}</h2>
              <p>Status: <span className="capitalize">{delivery.status}</span></p>
              <p className="text-sm text-gray-600">
                Customer Location: {delivery.customerLocation.lat}, {delivery.customerLocation.lng}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

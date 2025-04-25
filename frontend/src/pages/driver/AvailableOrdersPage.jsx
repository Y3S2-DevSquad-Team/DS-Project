import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AvailableOrdersPage() {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDeliveries = async () => {
      try {
        const res = await axios.get("http://localhost:4002/api/delivery/available");
        setDeliveries(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailableDeliveries();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("accessToken"); // assuming you stored token
      await axios.patch(
        `http://localhost:4002/api/delivery/accept/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/driver/navigate/${id}`); // Redirect to navigation page
    } catch (err) {
      console.error(err);
      alert("Failed to accept delivery");
    }
  };

  return (
    <div className='min-h-screen p-6 text-white bg-secondary'>
      <h1 className='mb-4 text-2xl font-bold text-primary'>Available Deliveries</h1>
      {deliveries.length === 0 ? (
        <p>No deliveries available right now.</p>
      ) : (
        <div className='space-y-4'>
          {deliveries.map((d) => (
            <div key={d._id} className='flex items-center justify-between p-4 bg-white rounded shadow-md text-secondary'>
              <div>
                <p>
                  <strong>Order:</strong> {d.orderId}
                </p>
                <p>
                  <strong>Customer:</strong> {d.customerLocation.lat}, {d.customerLocation.lng}
                </p>
              </div>
              <button onClick={() => handleAccept(d._id)} className='px-4 py-2 text-white rounded bg-primary hover:bg-green-600'>
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

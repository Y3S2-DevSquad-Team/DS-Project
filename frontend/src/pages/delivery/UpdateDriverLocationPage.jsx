import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateDriverLocationPage() {
  const { driverId } = useParams();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/api/delivery/driver/${driverId}`);
        setDeliveries(res.data.deliveries || []);
      } catch (err) {
        console.error("Error fetching driver deliveries:", err);
      }
    };

    fetchDeliveries();
  }, [driverId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) return setMessage("❌ Please select a delivery");

    try {
      setLoading(true);
      await axios.patch(`http://localhost:4002/api/delivery/location/${selectedDelivery}`, coords);
      setMessage("✅ Location updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen p-6 bg-secondary text-white'>
      <h1 className='text-2xl font-bold mb-6 text-primary'>Update Driver Location</h1>

      <form onSubmit={handleSubmit} className='max-w-md bg-white p-6 rounded-lg text-secondary shadow space-y-4'>
        <label className='block font-medium'>Select Delivery</label>
        <select className='w-full p-3 rounded border border-gray-300' value={selectedDelivery} onChange={(e) => setSelectedDelivery(e.target.value)}>
          <option value=''>-- Choose --</option>
          {deliveries.map((d) => (
            <option key={d._id} value={d._id}>
              {d.orderId} ({d.status})
            </option>
          ))}
        </select>

        <label className='block font-medium mt-2'>Latitude</label>
        <input
          type='text'
          name='lat'
          value={coords.lat}
          onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
          required
          className='w-full p-3 rounded border border-gray-300'
        />

        <label className='block font-medium mt-2'>Longitude</label>
        <input
          type='text'
          name='lng'
          value={coords.lng}
          onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
          required
          className='w-full p-3 rounded border border-gray-300'
        />

        <button type='submit' disabled={loading} className='w-full bg-primary text-white font-semibold py-3 rounded hover:bg-green-600 transition'>
          {loading ? "Updating..." : "Update Location"}
        </button>

        {message && <p className='text-sm mt-2'>{message}</p>}
      </form>
    </div>
  );
}

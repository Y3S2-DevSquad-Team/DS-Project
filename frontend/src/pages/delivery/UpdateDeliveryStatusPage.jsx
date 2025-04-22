import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function UpdateDeliveryStatusPage() {
  const { deliveryId } = useParams();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const statuses = ["picked", "on the way", "delivered"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) return setMessage("❌ Please select a status");

    try {
      setLoading(true);
      await axios.patch(`http://localhost:4002/api/delivery/update/${deliveryId}`, { status });
      setMessage("✅ Status updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen p-6 bg-secondary text-white'>
      <h1 className='text-2xl font-bold mb-6 text-primary'>Update Delivery Status</h1>

      <form onSubmit={handleSubmit} className='max-w-md bg-white p-6 rounded-lg text-secondary shadow space-y-4'>
        <label className='block font-medium'>Select Status</label>
        <select className='w-full p-3 rounded border border-gray-300' value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value=''>-- Choose --</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type='submit' disabled={loading} className='w-full bg-primary text-white font-semibold py-3 rounded hover:bg-green-600 transition'>
          {loading ? "Updating..." : "Update Status"}
        </button>

        {message && <p className='text-sm mt-2'>{message}</p>}
      </form>
    </div>
  );
}

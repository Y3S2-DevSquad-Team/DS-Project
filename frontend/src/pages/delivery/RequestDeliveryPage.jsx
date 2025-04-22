import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RequestDeliveryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderId: "",
    customerLocation: { lat: "", lng: "" },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["lat", "lng"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        customerLocation: { ...prev.customerLocation, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:4002/api/delivery/assign", formData);
      setMessage("✅ Delivery assigned successfully!");
      setTimeout(() => navigate(`/delivery/track/${formData.orderId}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign delivery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-secondary text-white">
      <h1 className="text-2xl font-bold mb-6 text-primary">Request Delivery</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white rounded-lg p-6 text-secondary shadow-md">
        <label className="block font-medium">Order ID</label>
        <input
          type="text"
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block font-medium mt-4">Customer Latitude</label>
        <input
          type="text"
          name="lat"
          value={formData.customerLocation.lat}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block font-medium mt-4">Customer Longitude</label>
        <input
          type="text"
          name="lng"
          value={formData.customerLocation.lng}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Request Delivery"}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}

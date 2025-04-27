import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PickupPage() {
  const { id } = useParams(); // deliveryId
  const navigate = useNavigate();

  const handlePickup = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:4002/api/delivery/pickup/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // After pickup success, navigate to delivery-to-customer page
      navigate(`/driver/deliver/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to mark as picked up");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-secondary">
      <h1 className="mb-6 text-2xl font-bold text-primary">Confirm Pickup</h1>
      <button
        onClick={handlePickup}
        className="px-6 py-3 text-white transition rounded bg-primary hover:bg-green-600"
      >
        📦 I Picked Up the Order
      </button>
    </div>
  );
}

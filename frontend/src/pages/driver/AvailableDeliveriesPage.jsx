import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DeliveryRouteMap from "../../components/Delivery/DeliveryRouteMap";

export default function AvailableDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchAvailableDeliveries = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/delivery/available");
        setDeliveries(res.data);

        for (const delivery of res.data) {
          const { lat, lng } = delivery.customerLocation;
          const locationStr = `${lat},${lng}`;

          if (!locations[locationStr]) {
            const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEOCODING_API_KEY}`);
            const address = geoRes.data.results?.[0]?.formatted_address || "Unknown location";
            setLocations((prev) => ({ ...prev, [locationStr]: address }));
          }
        }
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
      const driverId = localStorage.getItem("userId");

      if (!driverId) {
        toast.error("Driver ID not found. Please log in again.");
        return;
      }

      const res = await axios.patch(
        `http://localhost:8080/api/delivery/accept/${deliveryId}`,
        { driverId }, // ✅ This is what the backend expects
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Keep if authToken middleware is used
          },
        }
      );

      toast.success("Delivery accepted successfully!");
      navigate("/driver/my-deliveries");
    } catch (error) {
      console.error("Failed to accept delivery:", error);

      const message = error.response?.data?.message || "Something went wrong. Try again later.";
      toast.error(`Error: ${message}`);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-semibold text-gray-700 animate-pulse'>Loading deliveries...</h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-4 py-8 bg-gray-50'>
      <h1 className='mb-6 text-3xl font-bold text-center text-green-600'>Available Deliveries</h1>

      {deliveries.length === 0 ? (
        <p className='text-center text-gray-500'>No deliveries available at the moment.</p>
      ) : (
        <ul className='space-y-4'>
          {deliveries.map((delivery) => {
            const { lat, lng } = delivery.customerLocation;
            const locationStr = `${lat},${lng}`;
            const readableLocation = locations[locationStr] || `${lat}, ${lng}`;

            return (
              <li
                key={delivery._id}
                className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-white shadow-sm border border-gray-200 rounded-lg'>
                <div>
                  <p className='text-gray-800 font-semibold'>🍽️ Restaurant: {delivery.restaurantName}</p>
                  <ul className='text-gray-600 ml-4 list-disc'>
                    {delivery.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.itemName} × {item.quantity} – Rs. {item.price}
                      </li>
                    ))}
                  </ul>
                  <p className='text-sm text-gray-500 mt-2'>📍 Location: {readableLocation}</p>
                  <p className='text-sm text-gray-500'>Status: {delivery.status}</p>
                </div>

                <div className='flex gap-3'>
                  <button
                    onClick={() => {
                      setSelectedLocation(delivery.customerLocation);
                      setShowMap(true);
                    }}
                    className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600'>
                    View Route
                  </button>
                  <button
                    onClick={() => handleAccept(delivery._id)}
                    className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600'>
                    Accept
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showMap && selectedLocation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60' onClick={() => setShowMap(false)}>
          <div className='bg-white rounded-lg shadow-xl p-4 w-[95%] max-w-3xl relative' onClick={(e) => e.stopPropagation()}>
            {/* ❌ Close button in top-right corner */}
            <button
              onClick={() => setShowMap(false)}
              className='absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg font-bold'
              aria-label='Close'>
              ✖
            </button>

            <h3 className='mb-4 text-xl font-bold text-center text-gray-800'>Delivery Route</h3>
            <DeliveryRouteMap destination={selectedLocation} />
          </div>
        </div>
      )}
    </div>
  );
}

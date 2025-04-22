import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

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

    fetchStatus();
    interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className='min-h-screen p-4 bg-secondary text-white'>
      <h1 className='text-2xl font-bold mb-4 text-primary'>Track Delivery</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='space-y-6'>
          <div className='bg-white text-secondary p-4 rounded shadow'>
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>Driver Location:</strong>
            </p>
            <p className='text-sm'>
              Lat: {driverLocation?.lat} | Lng: {driverLocation?.lng}
            </p>
          </div>

          {driverLocation && (
            <MapContainer
              center={[driverLocation.lat, driverLocation.lng]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "300px", width: "100%" }}
              className='rounded-lg shadow'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={[driverLocation.lat, driverLocation.lng]}>
                <Popup>Driver is here</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      )}
    </div>
  );
}

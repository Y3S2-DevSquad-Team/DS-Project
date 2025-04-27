import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function DeliverToCustomerPage() {
  const { id } = useParams(); // deliveryId
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/api/delivery/${id}`);
        setDelivery(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDelivery();
  }, [id]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setDriverLocation(coords);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (driverLocation && delivery?.customerLocation) {
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: driverLocation,
          destination: delivery.customerLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [driverLocation, delivery]);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:4002/api/delivery/deliver/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Delivery Completed Successfully!");
      navigate("/driver/available-orders"); // back to available deliveries
    } catch (error) {
      console.error(error);
      alert("Failed to complete delivery");
    }
  };

  if (!isLoaded) return <p className="text-white">Loading map...</p>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLocation || { lat: 6.9271, lng: 79.8612 }}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        {driverLocation && (
          <Marker position={driverLocation} label="You" />
        )}
        {delivery?.customerLocation && (
          <Marker
            position={delivery.customerLocation}
            label="Customer"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#FF6B00",
                strokeWeight: 6,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Floating Button */}
      <div className="absolute transform -translate-x-1/2 bottom-4 left-1/2">
        <button
          onClick={handleComplete}
          className="px-6 py-3 text-white transition rounded-full shadow bg-primary hover:bg-green-600"
        >
          ✅ Mark Delivery Complete
        </button>
      </div>
    </div>
  );
}

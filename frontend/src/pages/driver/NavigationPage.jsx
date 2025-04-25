import {
  GoogleMap,
  Marker,
  Polyline,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function NavigationPage() {
  const { id } = useParams(); // deliveryId
  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();

  // Get delivery info
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

  // Watch driver's location
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

  // Calculate route when both points are ready
  useEffect(() => {
    if (driverLocation && delivery?.restaurantLocation) {
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: driverLocation,
          destination: delivery.restaurantLocation,
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
        {delivery?.restaurantLocation && (
          <Marker
            position={delivery.restaurantLocation}
            label="Restaurant"
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
                strokeColor: "#06C167",
                strokeWeight: 6,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Floating Info */}
      <div className="absolute p-3 bg-white rounded shadow top-4 left-4 text-secondary">
        {delivery && (
          <>
            <p><strong>Order ID:</strong> {delivery.orderId}</p>
            <p><strong>Status:</strong> {delivery.status}</p>
          </>
        )}
      </div>
    </div>
  );
}

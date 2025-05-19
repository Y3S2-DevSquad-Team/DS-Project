import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "450px",
};

const DeliveryRouteMap = ({ destination }) => {
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentLocation(origin);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);

              const leg = result.routes[0].legs[0];
              setRouteDetails({
                distance: leg.distance.text,
                duration: leg.duration.text,
              });
            } else {
              console.error("Directions request failed due to " + status);
            }
          }
        );
      },
      (err) => {
        console.error("Error getting current location:", err);
      }
    );
  }, [destination]);

  const openInGoogleMaps = () => {
    if (!currentLocation || !destination) return;
    const originStr = `${currentLocation.lat},${currentLocation.lng}`;
    const destStr = `${destination.lat},${destination.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=driving`;
    window.open(url, "_blank");
  };

  if (!isLoaded || !currentLocation) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 animate-pulse">
        <p className="text-lg font-medium">Loading map and directions...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={12}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Floating Route Info Box */}
      {routeDetails && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-gray-300 shadow-lg rounded-xl p-4 z-10">
          <p className="text-gray-800 font-semibold text-base mb-1">
            📍 Distance: <span className="text-green-600">{routeDetails.distance}</span>
          </p>
          <p className="text-gray-800 font-semibold text-base">
            ⏱️ Estimated Time: <span className="text-blue-600">{routeDetails.duration}</span>
          </p>
        </div>
      )}

      {/* Open in Google Maps CTA */}
      <div className="mt-6 text-center">
        <button
          onClick={openInGoogleMaps}
          className="px-6 py-3 text-sm font-bold tracking-wide text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
          🚗 Open in Google Maps
        </button>
      </div>
    </div>
  );
};

export default DeliveryRouteMap;

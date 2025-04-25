import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useRef } from "react";

// 🔒 Static array to avoid performance warning
const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 };

export default function MapSelector({
  onLocationSelect = () => {},
  showMarker = true,
  markerPosition,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyBY5QMn0JypwpTcPghmtJlpRy59fNNnz9Q",
    libraries,
    language: "en",
  });

  const [selected, setSelected] = useState(markerPosition || null);
  const mapRef = useRef();
  const autoRef = useRef();

  const handleClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSelected(coords);
    onLocationSelect(coords);
  };

  const handlePlaceChange = () => {
    const place = autoRef.current.getPlace();
    if (!place.geometry) return;
    const location = place.geometry.location;
    const coords = {
      lat: location.lat(),
      lng: location.lng(),
    };
    setSelected(coords);
    onLocationSelect(coords);
    mapRef.current.panTo(coords);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelected(coords);
        onLocationSelect(coords);
        mapRef.current.panTo(coords);
      },
      () => alert("Unable to retrieve your location.")
    );
  };

  if (!isLoaded) return <p className="text-white">Loading map...</p>;

  return (
    <div className="relative">
      {/* 🔍 Search Input */}
      <Autocomplete
        onLoad={(ref) => (autoRef.current = ref)}
        onPlaceChanged={handlePlaceChange}
      >
        <input
          type="text"
          placeholder="Search location..."
          className="absolute z-10 px-4 py-2 text-black rounded-md shadow left-4 top-4 w-72"
        />
      </Autocomplete>

      {/* 🗺 Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selected || defaultCenter}
        zoom={14}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {showMarker && selected && <Marker position={selected} />}
      </GoogleMap>

      {/* 📍 Floating My Location Button */}
      <button
        onClick={handleUseMyLocation}
        className="absolute z-10 px-4 py-2 text-white transition rounded-full shadow bottom-4 right-4 bg-primary hover:bg-green-600"
      >
        📍 Use My Location
      </button>
    </div>
  );
}

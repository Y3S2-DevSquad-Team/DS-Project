import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 };

export default function MapSelector({ onLocationSelect = () => {}, showMarker = true, markerPosition }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_KEY_HERE",
    libraries,
    language: "en",
  });

  const [selected, setSelected] = useState(markerPosition || null);
  const mapRef = useRef();
  const autoRef = useRef();

  // When clicking on map
  const handleClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSelected(coords);
    onLocationSelect(coords);
  };

  // When searching via Autocomplete
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

  // When clicking "Use My Location"
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
        if (mapRef.current) mapRef.current.panTo(coords);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        alert("Unable to retrieve your location: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  if (!isLoaded) return <p className='text-gray-700'>Loading map...</p>;

  return (
    <div className='relative'>
      {/* 🔍 Autocomplete Search Input */}
      <Autocomplete onLoad={(ref) => (autoRef.current = ref)} onPlaceChanged={handlePlaceChange}>
        <input
          type='text'
          placeholder='Search location...'
          className='absolute z-10 px-4 py-2 text-black rounded-md shadow-md left-4 top-4 w-[280px] focus:outline-none'
        />
      </Autocomplete>

      {/* 🗺 Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selected || defaultCenter}
        zoom={14}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}>
        {showMarker && selected && <Marker position={selected} />}
      </GoogleMap>

      {/* 📍 Floating "My Location" Button */}
      <button
        onClick={handleUseMyLocation}
        className='absolute z-10 px-4 py-2 text-white transition bg-blue-600 rounded-full shadow bottom-4 right-4 hover:bg-blue-700'>
        📍 Use My Location
      </button>
    </div>
  );
}

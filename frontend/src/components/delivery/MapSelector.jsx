import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
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

  // Handle click on map
  const handleClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSelected(coords);
    onLocationSelect(coords);
  };

  // Handle place autocomplete
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

  // Use My Location button
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
    <div className='relative w-full h-[450px] mt-4 rounded-xl overflow-hidden shadow-lg bg-white'>
      {/* Autocomplete Search */}
      <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md'>
        <Autocomplete onLoad={(ref) => (autoRef.current = ref)} onPlaceChanged={handlePlaceChange}>
          <input
            type='text'
            placeholder='Search location...'
            className='w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500'
          />
        </Autocomplete>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selected || defaultCenter}
        zoom={14}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}>
        {showMarker && selected && <Marker position={selected} />}
      </GoogleMap>

      {/* Use My Location Button */}
      <button
        onClick={handleUseMyLocation}
        className='absolute px-5 py-3 font-semibold text-white transition-all bg-green-500 rounded-full shadow-lg bottom-4 right-4 hover:bg-green-600'>
        📍 Use My Location
      </button>
    </div>
  );
}

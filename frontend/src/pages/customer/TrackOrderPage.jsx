// src/pages/customer/TrackOrderPage.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Google Maps JavaScript API Loader
const loadGoogleMaps = (callback) => {
  if (typeof window.google === "object" && typeof window.google.maps === "object") {
    callback();
  } else {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`; // 🔥 Key from .env
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  }
};

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/delivery/api/delivery/status/${orderId}`);
        setDelivery(res.data);
      } catch (error) {
        console.error("Failed to fetch delivery status:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchDeliveryStatus();
  }, [orderId]);

  useEffect(() => {
    if (delivery && delivery.driverLocation && delivery.driverLocation.lat !== null) {
      loadGoogleMaps(() => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: {
            lat: delivery.driverLocation.lat,
            lng: delivery.driverLocation.lng,
          },
          zoom: 15,
        });

        new window.google.maps.Marker({
          position: {
            lat: delivery.driverLocation.lat,
            lng: delivery.driverLocation.lng,
          },
          map,
          title: "Driver Location",
        });
      });
    }
  }, [delivery]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-gray-700'>Tracking your order...</h2>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-red-500'>Failed to track your order</h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <h1 className='mb-6 text-3xl font-bold text-center text-green-600'>Order Tracking</h1>

      <div className='max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md'>
        <h2 className='mb-4 text-xl font-semibold text-gray-800'>
          Delivery Status: <span className='text-blue-500'>{delivery.status}</span>
        </h2>

        <div id='map' className='w-full rounded-md shadow-inner h-96' />
      </div>
    </div>
  );
}

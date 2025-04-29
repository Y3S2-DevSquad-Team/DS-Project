import MapSelector from "../components/Delivery/MapSelector";

export default function SelectAddressPage() {
  const handleLocation = (location) => {
    console.log("📍 Selected Location:", location);
    // Save to state, Redux, context, or backend
  };

  return (
    <div className="min-h-screen p-6 text-gray-900 bg-gray-100">
      <h2 className="mb-4 text-xl font-bold text-primary">Choose Your Delivery Location</h2>
      <MapSelector onLocationSelect={handleLocation} />
    </div>
  );
}

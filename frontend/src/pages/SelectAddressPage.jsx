import MapSelector from "../components/MapSelector";

export default function SelectAddressPage() {
  const handleLocation = (location) => {
    console.log("Selected Location:", location);
    // Save to state, context, or send to backend
  };

  return (
    <div className="min-h-screen p-6 text-white bg-secondary">
      <h2 className="mb-4 text-xl font-bold text-primary">Choose Your Delivery Location</h2>
      <MapSelector onLocationSelect={handleLocation} />
    </div>
  );
}

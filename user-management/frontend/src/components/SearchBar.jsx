export default function SearchBar() {
  return (
    <div className="w-full mb-4">
      <input
        type="text"
        placeholder="Search for restaurants or dishes..."
        className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

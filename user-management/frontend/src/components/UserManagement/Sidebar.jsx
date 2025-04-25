const Sidebar = ({ onSelectRole }) => {
  return (
    <div className="w-64 min-h-screen bg-[#1d1d1d] text-white flex flex-col p-6 shadow-lg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">YumGo</h1>
        <p className="text-muted text-sm">Delivery Partner App</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelectRole("Customer")}
          className="bg-primary text-black font-bold py-2 px-4 rounded hover:bg-primaryDark transition"
        >
          Sign Up as Customer
        </button>
        <button
          onClick={() => onSelectRole("DeliveryPerson")}
          className="bg-primary text-black font-bold py-2 px-4 rounded hover:bg-primaryDark transition"
        >
          Sign Up as Delivery Person
        </button>
        <button
          onClick={() => onSelectRole("Restaurant")}
          className="bg-primary text-black font-bold py-2 px-4 rounded hover:bg-primaryDark transition"
        >
          Sign Up as Restaurant
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

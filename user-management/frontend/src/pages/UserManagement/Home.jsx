import { useState } from "react";
import Sidebar from "../../components/UserManagement/Sidebar";
import CustomerSignupForm from "../../components/UserManagement/CustomerSignupForm";

const Home = () => {
  const [activeRole, setActiveRole] = useState("Customer");

  const renderSignupForm = () => {
    switch (activeRole) {
      case "Customer":
        return <CustomerSignupForm />;
      case "DeliveryPerson":
        return (
          <div className="p-6 text-white">Delivery Signup Coming Soon</div>
        );
      case "Restaurant":
        return (
          <div className="p-6 text-white">Restaurant Signup Coming Soon</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-darkBg text-white">
      <Sidebar onSelectRole={setActiveRole} />
      <div className="flex-1 overflow-y-auto">{renderSignupForm()}</div>
    </div>
  );
};

export default Home;

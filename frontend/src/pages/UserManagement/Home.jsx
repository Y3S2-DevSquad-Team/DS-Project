import { useState } from "react";
import Sidebar from "../../components/UserManagement/Sidebar";
import CustomerSignupForm from "../../components/UserManagement/CustomerSignupForm";
import DeliveryPersonSignupForm from "../../components/UserManagement/DeliveryPersonSignupForm";
import RestaurantSignupForm from "../../components/UserManagement/RestaurantSignupForm";
import LoginForm from "../../components/UserManagement/LoginForm";

const Home = () => {
  const [activeRole, setActiveRole] = useState("Login");

  const renderSignupForm = () => {
    switch (activeRole) {
      case "Customer":
        return <CustomerSignupForm />;
      case "DeliveryPerson":
        return <DeliveryPersonSignupForm />;
      case "Restaurant":
        return <RestaurantSignupForm />;
      case "Login":
        return <LoginForm />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen text-gray-800 bg-gray-100">
      <Sidebar onSelectRole={setActiveRole} />
      <div className="flex-1 p-6 overflow-y-auto">{renderSignupForm()}</div>
    </div>
  );
};

export default Home;

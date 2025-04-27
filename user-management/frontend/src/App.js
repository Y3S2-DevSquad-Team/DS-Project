import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/UserManagement/Home";
// import Home from "../src/pages/Home";
import ErrorPage from "./pages/Errors/ServerError";
import NotFoundPage from "./pages/Errors/NotFoundPage";
import CustomerProfile from "../src/pages/UserManagement/CustomerProfile";
import DeliveryPersonProfile from "../src/pages/UserManagement/DeliveryPersonProfile";
import RestaurantProfile from "../src/pages/UserManagement/RestaurantProfile";
import LoginForm from "../src/components/UserManagement/LoginForm.jsx";
// import Restaurants from "../src/pages/UserManagement/Restaurants";
// import Profile from "../src/pages/UserManagement/Profile";

function App() {
  return (
    <Router>
      <div className="bg-secondary min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/500" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route
            path="delivery-person/profile"
            element={<DeliveryPersonProfile />}
          />
          <Route path="/restaurant/profile" element={<RestaurantProfile />} />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

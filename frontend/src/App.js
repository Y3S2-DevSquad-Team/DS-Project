import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

import RequestDeliveryPage from "./pages/delivery/RequestDeliveryPage";
import TrackDeliveryPage from "./pages/delivery/TrackDeliveryPage";
import DriverDeliveriesPage from "./pages/delivery/DriverDeliveriesPage";
import UpdateDriverLocationPage from "./pages/delivery/UpdateDriverLocationPage";
import UpdateDeliveryStatusPage from "./pages/delivery/UpdateDeliveryStatusPage";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />

        {/* Delivery */}
        <Route path='/delivery/request' element={<RequestDeliveryPage />} />
        <Route path='/delivery/track/:orderId' element={<TrackDeliveryPage />} />
        <Route path='/driver/:driverId/deliveries' element={<DriverDeliveriesPage />} />
        <Route path='/driver/:driverId/update-location' element={<UpdateDriverLocationPage />} />
        <Route path='/driver/:driverId/delivery/:deliveryId/update-status' element={<UpdateDeliveryStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;

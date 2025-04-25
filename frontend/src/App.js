import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

import RequestDeliveryPage from "./pages/delivery/RequestDeliveryPage";
import TrackDeliveryPage from "./pages/delivery/TrackDeliveryPage";
import DriverDeliveriesPage from "./pages/delivery/DriverDeliveriesPage";
import UpdateDriverLocationPage from "./pages/delivery/UpdateDriverLocationPage";
import UpdateDeliveryStatusPage from "./pages/delivery/UpdateDeliveryStatusPage";
import SelectAddressPage from "./pages/SelectAddressPage";
import NavigationPage from "./pages/driver/NavigationPage";
import PickupPage from "./pages/driver/PickupPage";
import DeliverToCustomerPage from "./pages/driver/DeliverToCustomerPage";
import PaymentRedirectPage from "./pages/payment/PaymentRedirectPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentCancelPage from "./pages/payment/PaymentCancelPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";

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
        <Route path='/select-address' element={<SelectAddressPage />} />
        <Route path='/driver/navigate/:id' element={<NavigationPage />} />
        <Route path='/driver/pickup/:id' element={<PickupPage />} />
        <Route path='/driver/deliver/:id' element={<DeliverToCustomerPage />} />
        <Route path='/payment/redirect' element={<PaymentRedirectPage />} />
        <Route path='/payment/success' element={<PaymentSuccessPage />} />
        <Route path='/payment/cancel' element={<PaymentCancelPage />} />
        <Route path="/customer/orders" element={<CustomerOrdersPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />

        {/* navigate(`/payment/redirect?orderId=${orderId}&amount=${totalAmount}`); */}

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

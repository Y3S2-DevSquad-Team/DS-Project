import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Register from "./pages/UserManagement/Home";
import MainHome from "./pages/Home";
import ErrorPage from "./pages/Errors/ServerError";
import NotFoundPage from "./pages/Errors/NotFoundPage";
import LoginForm from "./components/UserManagement/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";

// Customer Pages
import CustomerProfile from "./pages/UserManagement/CustomerProfile";
import CustomerOrdersPage from "./pages/customer/MyOrdersPage";
import SelectAddressPage from "./pages/SelectAddressPage";
import MenuPage from "./pages/order/MenuPage";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Cart/CheckoutPage";
import OrdersListPage from "./pages/order/OrdersListPage";
import OrderStatusPage from "./pages/order/OrderStatusPage";
import TrackOrderPage from "./pages/customer/TrackOrderPage"; 
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import OrderDetailsPage from "./pages/customer/OrderDetailsPage";

// Delivery Person Pages
import DeliveryPersonProfile from "./pages/UserManagement/DeliveryPersonProfile";
import RequestDeliveryPage from "./pages/delivery/RequestDeliveryPage";
import TrackDeliveryPage from "./pages/delivery/TrackDeliveryPage";
import DriverDeliveriesPage from "./pages/delivery/DriverDeliveriesPage";
import UpdateDriverLocationPage from "./pages/delivery/UpdateDriverLocationPage";
import UpdateDeliveryStatusPage from "./pages/delivery/UpdateDeliveryStatusPage";
import NavigationPage from "./pages/driver/NavigationPage";
import PickupPage from "./pages/driver/PickupPage";
import DeliverToCustomerPage from "./pages/driver/DeliverToCustomerPage";

import AvailableDeliveriesPage from "./pages/driver/AvailableDeliveriesPage";
import MyDeliveriesPage from "./pages/driver/MyDeliveriesPage";

// Restaurant Pages
import RestaurantProfile from "./pages/UserManagement/RestaurantProfile";
import RestaurantDetails from "./pages/Restaurant/RestaurantDetails";

// Payment Pages
import PaymentRedirectPage from "./pages/payment/PaymentRedirectPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentCancelPage from "./pages/payment/PaymentCancelPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";

function App() {
  return (
    <Router>
      <Navbar />
<div className="mt-10">
      <Routes>
        {/* Public Pages */}

        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<Register />} />
        <Route path='/500' element={<ErrorPage />} />
        <Route path='*' element={<NotFoundPage />} />

        {/* Customer Routes */}
        {/* <Route element={<ProtectedRoute requiredRole='Customer' />}> */}
          <Route path='/' element={<MainHome />} />
          <Route path='/customer/profile' element={<CustomerProfile />} />
          <Route path='/customer/orders' element={<CustomerOrdersPage />} />
          <Route path='/select-address' element={<SelectAddressPage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/orders' element={<OrdersListPage />} />
          <Route path='/orders/:id' element={<OrderStatusPage />} />
          <Route path="/track/:orderId" element={<TrackOrderPage />} />
          <Route path='/customer/my-orders' element={<MyOrdersPage />} />
          <Route path='/customer/track-order/:orderId' element={<OrderDetailsPage />} />

        {/* </Route> */}

        {/* Delivery Person Routes */}
        <Route path='/delivery-person/profile' element={<DeliveryPersonProfile />} />
        <Route path='/delivery/request' element={<RequestDeliveryPage />} />
        <Route path='/delivery/track/:orderId' element={<TrackDeliveryPage />} />
        <Route path='/driver/:driverId/deliveries' element={<DriverDeliveriesPage />} />
        <Route path='/driver/:driverId/update-location' element={<UpdateDriverLocationPage />} />
        <Route path='/driver/:driverId/delivery/:deliveryId/update-status' element={<UpdateDeliveryStatusPage />} />
        <Route path='/driver/navigate/:id' element={<NavigationPage />} />
        <Route path='/driver/pickup/:id' element={<PickupPage />} />
        <Route path='/driver/deliver/:id' element={<DeliverToCustomerPage />} />

        <Route path='/driver/available-deliveries' element={<AvailableDeliveriesPage />} />
        <Route path='/driver/my-deliveries' element={<MyDeliveriesPage />} />

        {/* Restaurant Routes */}
        <Route path='/restaurant/profile' element={<RestaurantProfile />} />
        <Route path='/restaurant/:id' element={<RestaurantDetails />} />

        {/* Payment Pages */}
        <Route path='/payment/redirect' element={<PaymentRedirectPage />} />
        <Route path='/payment/success' element={<PaymentSuccessPage />} />
        <Route path='/payment/cancel' element={<PaymentCancelPage />} />
        <Route path='/admin/payments' element={<AdminPaymentsPage />} />
      </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

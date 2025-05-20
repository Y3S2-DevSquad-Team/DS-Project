import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MapSelector from "../../components/delivery/MapSelector";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCoords, setDeliveryCoords] = useState(null);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }
    if (!deliveryCoords) {
      alert("Please select your exact delivery location on the map");
      return;
    }

    try {
      // ✅ Save checkout info locally (temporarily)
      localStorage.setItem("checkoutAddress", deliveryAddress);
      localStorage.setItem("checkoutCoords", JSON.stringify(deliveryCoords));
      localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
      localStorage.setItem("checkoutTotalAmount", totalAmount);

      // ✅ Redirect to Payment Gateway
      navigate(`/payment/redirect?amount=${totalAmount}`);
    } catch (err) {
      console.error("Failed to prepare for checkout:", err);
      alert("Failed to checkout. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h2 className='mb-4 text-2xl font-bold text-gray-700'>Your cart is empty</h2>
        <button onClick={() => navigate("/")} className='font-semibold text-green-600 hover:underline'>
          Go back to restaurants
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <div className='max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md'>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>Checkout</h2>

        {/* Delivery Address Input */}
        <div className='mb-8'>
          <label className='block mb-2 text-sm font-semibold text-gray-700'>Delivery Address *</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className='w-full p-4 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            rows='3'
            placeholder='Enter your full delivery address here...'></textarea>
        </div>

        {/* Map Selector */}
        <div className='mb-8'>
          <label className='block mb-2 text-sm font-semibold text-gray-700'>Select Exact Location on Map *</label>
          <MapSelector onLocationSelect={setDeliveryCoords} />
        </div>

        {/* Cart Summary */}
        <div className='mb-8 space-y-4'>
          {cartItems.map((item) => (
            <div key={item._id} className='flex items-center justify-between pb-3 border-b'>
              <div>
                <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                <p className='text-sm text-gray-500'>
                  {item.quantity} × Rs {item.price}
                </p>
              </div>
              <p className='font-semibold text-gray-800'>Rs {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total + Proceed Button */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold text-gray-800'>Total: Rs {totalAmount.toFixed(2)}</h3>
          <button onClick={handleCheckout} className='px-6 py-3 font-bold text-white transition bg-green-500 rounded-md hover:bg-green-600'>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

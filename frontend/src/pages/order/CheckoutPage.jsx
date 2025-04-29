import React, { useState } from "react";
import { useCart } from "../../components/order/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId") || "dummyUserId"; // Later replace with real user ID
      const restaurantId = localStorage.getItem("restaurantId") || "dummyRestaurantId"; // Later replace
      const restaurantName = localStorage.getItem("restaurantName") || "Demo Restaurant";

      const orderData = {
        userId,
        restaurantId,
        restaurantName,
        items: cartItems.map((item) => ({
          productId: item.id || item.name,
          itemName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        deliveryAddress,
      };

      const response = await axios.post(
        "http://localhost:8080/api/order/create", // ✅ use API Gateway
        orderData
      );

      if (response.status !== 201) throw new Error("Failed to place order");

      const result = response.data;
      clearCart();
      navigate(`/payment/redirect?orderId=${result._id}&amount=${totalAmount}`);
    } catch (err) {
      console.error("Checkout error:", err.message);
      setError(err.message || "Failed to checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md min-h-screen p-6 mx-auto text-gray-900 bg-gray-100">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-3 text-lg font-bold">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.name} className="flex justify-between py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-4 font-bold border-t">
            <span>Total:</span>
            <span>Rs. {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

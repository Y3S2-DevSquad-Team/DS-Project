import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        userId: "current_user_id", // Replace with actual user ID from auth
        restaurantId: "restaurant_id", // Get from context or menu
        restaurantName: "Restaurant Name", // Get from context
        items: cartItems.map(item => ({
          menuItemId: item.id || item.name, // Use name if no ID exists
          itemName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryAddress,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to place order');

      const result = await response.json();
      clearCart();
      navigate(`/orders/${result._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.name} className="flex justify-between py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 font-bold flex justify-between">
            <span>Total:</span>
            <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

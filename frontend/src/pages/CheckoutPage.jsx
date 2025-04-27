import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate items before sending
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const invalidItems = cartItems.filter(item => 
        !item.name || !item.price || !item.quantity
      );
      
      if (invalidItems.length > 0) {
        throw new Error('Some items in your cart are invalid');
      }

      const orderData = {
        userId: 'guest',
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total
      };

      console.log('Submitting order:', orderData);

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Order response:', response.data);
      clearCart();
      navigate('/order-confirmation', { state: { order: response.data } });
    } catch (error) {
      console.error('Full error details:', error);
      
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // No response received
        console.error('No response from server');
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        // Request setup error
        console.error('Request error:', error.message);
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Your cart is currently empty.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="mt-2 text-blue-600 underline"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Your Order:</h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex justify-between items-start border-b pb-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">× {item.quantity}</p>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Total Amount:</h2>
              <p className="text-xl font-bold">${total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
              cartItems.length === 0 || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;

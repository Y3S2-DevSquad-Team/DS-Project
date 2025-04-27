import React, { useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage mounted with items:', cartItems);
    return () => console.log('CartPage unmounted');
  }, [cartItems]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrease = (name, price) => {
    const item = cartItems.find(item => item.name === name && item.price === price);
    updateQuantity(name, price, item.quantity + 1);
  };
  
  const handleDecrease = (name, price) => {
    const item = cartItems.find(item => item.name === name && item.price === price);
    if (item.quantity > 1) {
      updateQuantity(name, price, item.quantity - 1);
    } else {
      removeFromCart(name, price);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="bg-white p-4 rounded-lg shadow space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => handleDecrease(item.name, item.price)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-lg"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button 
                      onClick={() => handleIncrease(item.name, item.price)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.name, item.price)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Total:</h2>
              <p className="text-xl font-bold">${total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mt-4 w-full transition-colors"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
import React, { useEffect } from "react";
import { useCart } from "../../components/order/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CartPage mounted with items:", cartItems);
    return () => console.log("CartPage unmounted");
  }, [cartItems]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrease = (name, price) => {
    const item = cartItems.find((item) => item.name === name && item.price === price);
    updateQuantity(name, price, item.quantity + 1);
  };

  const handleDecrease = (name, price) => {
    const item = cartItems.find((item) => item.name === name && item.price === price);
    if (item.quantity > 1) {
      updateQuantity(name, price, item.quantity - 1);
    } else {
      removeFromCart(name, price);
    }
  };

  return (
    <div className="min-h-screen p-4 text-gray-900 bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="p-4 space-y-2 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Rs. {item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => handleDecrease(item.name, item.price)} className="px-3 py-1 bg-gray-100 rounded-l-lg hover:bg-gray-200" disabled={item.quantity <= 1}>-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.name, item.price)} className="px-3 py-1 bg-gray-100 rounded-r-lg hover:bg-gray-200">+</button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.name, item.price)} className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 mt-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Total:</h2>
              <p className="text-xl font-bold">Rs. {total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full px-6 py-3 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={cartItems.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

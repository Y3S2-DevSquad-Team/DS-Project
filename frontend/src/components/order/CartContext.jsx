import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      // Use item name as the unique identifier
      const existing = prev.find((i) => i.name === item.name && i.price === item.price);

      return existing
        ? prev.map((i) => (i.name === item.name && i.price === item.price ? { ...i, quantity: i.quantity + 1 } : i))
        : [
            ...prev,
            {
              name: item.name,
              price: item.price,
              quantity: 1,
              // Include any other relevant item data
              ...(item.imageUrl && { imageUrl: item.imageUrl }),
            },
          ];
    });
  };

  const removeFromCart = (name, price) => {
    setCartItems((prev) => prev.filter((item) => !(item.name === name && item.price === price)));
  };

  const updateQuantity = (name, price, newQuantity) => {
    setCartItems((prev) => prev.map((item) => (item.name === name && item.price === price ? { ...item, quantity: newQuantity } : item)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

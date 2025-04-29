import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";
import { store } from "./store"; // Make sure you export this from `store/index.js`

import { CartProvider } from "./contexts/CartContext"; // Import your CartProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
      <ToastContainer autoClose={2000} />
    </React.StrictMode>
  </Provider>
);

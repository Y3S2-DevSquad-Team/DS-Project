import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../contexts/CartContext";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/payment/api/payment/status/${orderId}`);
        if (res.data.status === "success") {
          setStatus("success");

          // ✅ Clear cart and local storage
          clearCart();
          localStorage.removeItem("checkoutAddress");
          localStorage.removeItem("checkoutCoords");
          localStorage.removeItem("checkoutCart");
          localStorage.removeItem("checkoutTotalAmount");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    if (orderId) fetchStatus();
  }, [orderId, navigate, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-800 bg-gray-100">
      {status === "loading" && <p className="text-lg font-semibold">Verifying your payment...</p>}

      {status === "success" && (
        <>
          <h2 className="mb-4 text-3xl font-bold text-green-600">✅ Payment Successful!</h2>
          <p className="mb-6 text-gray-600">Your order has been placed successfully. Thank you for choosing YumGo!</p>

          <button
            onClick={() => navigate("/customer/orders")}
            className="px-6 py-3 font-bold text-white transition bg-green-500 rounded-md hover:bg-green-600"
          >
            View My Orders
          </button>
        </>
      )}

      {status === "pending" && (
        <>
          <h2 className="mb-4 text-3xl font-bold text-yellow-500">⏳ Payment Pending</h2>
          <p className="text-gray-600">We are still verifying your payment. Please wait a moment.</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="mb-4 text-3xl font-bold text-red-500">❌ Payment Failed</h2>
          <p className="text-gray-600">Something went wrong. Please try again or contact support.</p>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 mt-6 font-bold text-white transition bg-green-500 rounded-md hover:bg-green-600"
          >
            Retry Payment
          </button>
        </>
      )}
    </div>
  );
}

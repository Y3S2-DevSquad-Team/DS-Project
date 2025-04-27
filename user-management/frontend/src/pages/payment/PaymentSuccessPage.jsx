import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:4003/api/payment/status/${orderId}`);
        if (res.data.status === "success") {
          setStatus("success");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    if (orderId) fetchStatus();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-secondary">
      {status === "loading" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <>
          <h2 className="mb-4 text-2xl font-bold text-green-400">✅ Payment Successful!</h2>
          <p>Your order has been confirmed.</p>
          <button
            className="px-5 py-2 mt-6 rounded bg-primary hover:bg-green-600"
            onClick={() => navigate("/customer/orders")}
          >
            View My Orders
          </button>
        </>
      )}
      {status === "pending" && (
        <>
          <h2 className="mb-4 text-2xl font-bold text-yellow-300">⏳ Payment Pending</h2>
          <p>We're waiting for confirmation from the bank.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h2 className="mb-4 text-2xl font-bold text-red-400">❌ Payment Failed</h2>
          <p>Please try again or contact support.</p>
        </>
      )}
    </div>
  );
}

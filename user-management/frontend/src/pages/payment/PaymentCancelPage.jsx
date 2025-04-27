import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-secondary">
      <h2 className="mb-4 text-2xl font-bold text-red-500">❌ Payment Cancelled</h2>
      <p>You cancelled the payment. Your order is not confirmed.</p>
      <button
        className="px-5 py-2 mt-6 rounded bg-primary hover:bg-green-600"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}

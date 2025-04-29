import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-800 bg-gray-100">
      <h2 className="mb-4 text-3xl font-bold text-red-500">❌ Payment Cancelled</h2>
      <p className="text-gray-600">You cancelled the payment. Your order is not confirmed.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 mt-6 font-bold text-white transition bg-green-500 rounded-md hover:bg-green-600"
      >
        Back to Home
      </button>
    </div>
  );
}

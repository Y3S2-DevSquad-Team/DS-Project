import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        const res = await axios.post("http://localhost:8080/api/payment/initiate", {
          orderId,
          userId: localStorage.getItem("userId"), // Assuming you stored after login
          amount,
          first_name: "Test",
          last_name: "User",
          email: "testuser@example.com",
          phone: "0770000000",
          address: "Colombo 7",
          city: "Colombo",
        });

        const { payhereURL, payload } = res.data;

        // Dynamically create a form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = payhereURL;

        for (const key in payload) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payload[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.error("Payment initiation failed:", err);
      }
    };

    initiatePayment();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-900 bg-gray-100">
      <h2 className="text-xl font-bold">Redirecting to Payment Gateway...</h2>
    </div>
  );
}

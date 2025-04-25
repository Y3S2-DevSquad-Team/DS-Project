import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");
        const userId = localStorage.getItem("userId"); // adjust as needed

        // Static dummy user data (replace with real)
        const user = {
          first_name: "Yasiru",
          last_name: "K",
          email: "yasiru@example.com",
          phone: "0770000000",
          address: "123 Main Street",
          city: "Colombo",
        };

        const res = await axios.post("http://localhost:4003/api/payment/initiate", {
          orderId,
          userId,
          amount,
          ...user,
        });

        const { payhereURL, payload } = res.data;

        // Create form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = payhereURL;

        Object.keys(payload).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payload[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.error(err);
        alert("Failed to initiate payment");
      }
    };

    initiatePayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-secondary">
      <h2 className="mb-4 text-xl">Redirecting to PayHere...</h2>
      <p>Please wait, you will be redirected in a moment.</p>
    </div>
  );
}

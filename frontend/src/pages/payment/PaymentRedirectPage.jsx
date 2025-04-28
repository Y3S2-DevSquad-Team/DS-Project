import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initiatePaymentFlow = async () => {
      try {
        const amount = parseFloat(searchParams.get("amount"));
        const userId = localStorage.getItem("userId");
        const restaurantId = localStorage.getItem("restaurantId");
        const restaurantName = localStorage.getItem("restaurantName");

        const userEmail = localStorage.getItem("userEmail");
        const userPhone = localStorage.getItem("userPhone");
        const firstName = localStorage.getItem("userFirstName");
        const lastName = localStorage.getItem("userLastName");

        const deliveryAddress = localStorage.getItem("checkoutAddress");
        const deliveryCoords = JSON.parse(localStorage.getItem("checkoutCoords"));
        const cartItems = JSON.parse(localStorage.getItem("checkoutCart"));
        const totalAmount = parseFloat(localStorage.getItem("checkoutTotalAmount"));

        if (!userId || !cartItems || !restaurantId || !restaurantName || !deliveryAddress) {
          console.error("Missing required data for checkout.");
          return;
        }

        // 1️⃣ Create Order First (sending order only)
        const createOrderResponse = await axios.post("http://localhost:8080/api/order/api/order", {
          userId,
          restaurantId,
          restaurantName,
          items: cartItems.map((item) => ({
            menuItemId: item._id,
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
          deliveryAddress,
          deliveryCoords, // optional
        });

        const createdOrder = createOrderResponse.data;
        const createdOrderId = createdOrder._id;

        console.log("[Checkout] Created Order ID:", createdOrderId);

        // 2️⃣ Initiate Payment after Order created
        const initiatePaymentResponse = await axios.post("http://localhost:8080/api/payment/api/payment/initiate", {
          orderId: createdOrderId,
          userId,
          amount: totalAmount,
          first_name: firstName || "Test",
          last_name: lastName || "User",
          email: userEmail || "test@example.com",
          phone: userPhone || "0770000000",
          address: deliveryAddress,
          city: "Colombo", // You can make this dynamic later
        });

        const { payhereURL, payload } = initiatePaymentResponse.data;

        console.log("[Checkout] Payment Payload prepared:", payload);

        // 3️⃣ Auto-submit form to PayHere
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

    initiatePaymentFlow();
  }, [searchParams]);

  return (
    <div className='flex items-center justify-center min-h-screen text-gray-800 bg-gray-100'>
      <h2 className='text-xl font-bold'>Redirecting to Payment Gateway...</h2>
    </div>
  );
}

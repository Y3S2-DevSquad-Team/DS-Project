import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentRedirectPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initiatePaymentFlow = async () => {
      try {
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

        if (!userId || !cartItems || !restaurantId || !restaurantName || !deliveryAddress || !deliveryCoords) {
          console.error("Missing required data for checkout.");
          return;
        }

        // Ensure deliveryCoords has the correct format
        if (!deliveryCoords.lat || !deliveryCoords.lng) {
          console.error("Invalid coordinates format:", deliveryCoords);
          return;
        }

        const formattedItems = cartItems.map((item) => ({
          menuItemId: item._id,
          itemName: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        // 1️⃣ Create Order
        const createOrderResponse = await axios.post("http://localhost:8080/api/orders", {
          userId,
          restaurantId,
          restaurantName,
          items: formattedItems,
          totalAmount,
          deliveryAddress,
          deliveryCoords,
        });

        const createdOrder = createOrderResponse.data;
        const createdOrderId = createdOrder._id;
        console.log("[Checkout] Created Order ID:", createdOrderId);

        // 2️⃣ Assign Delivery — ensure proper format for customerLocation
        await axios.post("http://localhost:8080/api/delivery/assign", {
          orderId: createdOrderId,
          restaurantName,
          items: formattedItems,
          customerLocation: {
            lat: deliveryCoords.lat,
            lng: deliveryCoords.lng
          },
        });
        console.log("[Checkout] Delivery assigned");

        // 3️⃣ Create Stripe Payment Session
        const paymentResponse = await axios.post("http://localhost:8080/api/payment/initiate", {
          orderId: createdOrderId,
          userId,
          amount: totalAmount,
          email: userEmail || "test@example.com",
        });

        const { url } = paymentResponse.data;
        if (!url) {
          throw new Error("Stripe session URL not returned");
        }

        // 4️⃣ Redirect to Stripe Checkout
        window.location.href = url;

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
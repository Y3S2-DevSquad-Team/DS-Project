import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // Assuming stored during login

  useEffect(() => {
    const fetchOrdersAndPayments = async () => {
      try {
        const orderRes = await axios.get(`http://localhost:4001/api/order/user/${userId}`);
        const ordersData = orderRes.data;
        setOrders(ordersData);

        // Fetch payment status for each order
        const paymentStatuses = {};
        for (const order of ordersData) {
          const paymentRes = await axios.get(`http://localhost:4003/api/payment/status/${order._id}`);
          paymentStatuses[order._id] = paymentRes.data.status;
        }
        setPayments(paymentStatuses);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrdersAndPayments();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-secondary">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-secondary">
      <h1 className="mb-6 text-2xl font-bold text-primary">My Orders & Payments</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 bg-white rounded shadow-md text-secondary">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
              <p><strong>Order Status:</strong> {order.status}</p>
              <p><strong>Payment Status:</strong> 
                <span className={`font-bold ml-2 ${payments[order._id] === 'success' ? 'text-green-600' : payments[order._id] === 'pending' ? 'text-yellow-500' : 'text-red-600'}`}>
                  {payments[order._id] || 'Unknown'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

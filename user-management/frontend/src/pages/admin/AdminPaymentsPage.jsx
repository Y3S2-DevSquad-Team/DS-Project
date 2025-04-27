import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:4003/api/payment/all");
        setPayments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen text-gray-800 bg-gray-100'>Loading payments...</div>;
  }

  return (
    <div className='min-h-screen p-8 text-gray-800 bg-gray-100'>
      <h1 className='mb-6 text-2xl font-bold text-primary'>All Payments (Admin View)</h1>

      {payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white rounded shadow'>
            <thead className='text-white bg-primary'>
              <tr>
                <th className='px-4 py-3'>Order ID</th>
                <th className='px-4 py-3'>User ID</th>
                <th className='px-4 py-3'>Amount (Rs.)</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className='border-b'>
                  <td className='px-4 py-2'>{p.orderId}</td>
                  <td className='px-4 py-2'>{p.userId}</td>
                  <td className='px-4 py-2'>{p.amount}</td>
                  <td className='px-4 py-2'>
                    <span
                      className={`font-semibold ${
                        p.status === "success" ? "text-green-600" : p.status === "pending" ? "text-yellow-500" : "text-red-500"
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className='px-4 py-2'>{new Date(p.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

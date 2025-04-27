// src/pages/OrderStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderStatusPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(response => setOrder(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <p className="mb-2">Status: {order.status}</p>

      <div className="bg-white p-4 rounded-lg shadow">
        {order.items.map(item => (
          <div key={item.menuId} className="flex justify-between mb-2">
            <div>{item.name}</div>
            <div>x {item.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusPage;

// src/api/orderApi.js
import axios from 'axios';

const ORDER_SERVICE_URL = 'http://localhost:5000/api/orders'; // Your order microservice URL

export const placeOrder = async (orderData, token) => {
  const response = await axios.post(`http://localhost:5000/api/orders/create`, orderData, {
    //headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCustomerOrders = async (token) => {
  const response = await axios.get(`${ORDER_SERVICE_URL}/orders/customer`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getOrderStatus = async (orderId, token) => {
  const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
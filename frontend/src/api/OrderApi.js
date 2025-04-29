import axios from 'axios';

// Gateway URL (not direct service URL anymore)
const ORDER_SERVICE_URL = 'http://localhost:8080/api/order';

export const placeOrder = async (orderData) => {
  const response = await axios.post(`${ORDER_SERVICE_URL}/create`, orderData);
  return response.data;
};

export const getCustomerOrders = async (userId) => {
  const response = await axios.get(`${ORDER_SERVICE_URL}/user/${userId}`);
  return response.data;
};

export const getOrderStatus = async (orderId) => {
  const response = await axios.get(`${ORDER_SERVICE_URL}/${orderId}`);
  return response.data;
};

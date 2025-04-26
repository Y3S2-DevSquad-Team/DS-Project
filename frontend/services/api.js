import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Restaurant API calls
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);

// Menu API calls
export const getMenuItemsByRestaurant = (restaurantId) => 
  api.get(`/menu-items/restaurant/${restaurantId}`);

// Order API calls
//export const createOrder = (orderData) => api.post('/orders', orderData);
//export const getOrderStatus = (orderId) => api.get(`/orders/${orderId}/status`);

export default api;
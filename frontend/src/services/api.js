import axios from 'axios';

const API = axios.create({
  baseURL: '',
});

// Interceptor to ensure token is sent on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('agritech_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Farms API
export const getFarms = () => API.get('/api/farms');
export const getFarmById = (id) => API.get(`/api/farms/${id}`);
export const createFarm = (data) => API.post('/api/farms', data);
export const updateFarm = (id, data) => API.put(`/api/farms/${id}`, data);
export const deleteFarm = (id) => API.delete(`/api/farms/${id}`);

// Crops API
export const getCrops = (farmId) => API.get('/api/crops', { params: { farmId } });
export const getCropById = (id) => API.get(`/api/crops/${id}`);
export const createCrop = (data) => API.post('/api/crops', data);
export const updateCrop = (id, data) => API.put(`/api/crops/${id}`, data);
export const deleteCrop = (id) => API.delete(`/api/crops/${id}`);

// Weather & Pest API
export const getWeather = (city) => API.get('/api/weather', { params: { city } });
export const getPestAlerts = (data) => API.post('/api/weather/pest-alerts', data);

// Resources / Marketplace API
export const getResources = (params) => API.get('/api/resources', { params });
export const getResourceById = (id) => API.get(`/api/resources/${id}`);
export const createResource = (data) => API.post('/api/resources', data);
export const updateResource = (id, data) => API.put(`/api/resources/${id}`, data);
export const deleteResource = (id) => API.delete(`/api/resources/${id}`);

// Orders API
export const createOrder = (data) => API.post('/api/orders', data);
export const getMyOrders = () => API.get('/api/orders/myorders');
export const getAllOrders = () => API.get('/api/orders');
export const updateOrderStatus = (id, data) => API.put(`/api/orders/${id}/status`, data);

// Forum Community API
export const getForumPosts = (params) => API.get('/api/forum', { params });
export const getForumPostById = (id) => API.get(`/api/forum/${id}`);
export const createForumPost = (data) => API.post('/api/forum', data);
export const addForumComment = (id, data) => API.post(`/api/forum/${id}/comments`, data);
export const toggleForumLike = (id) => API.post(`/api/forum/${id}/like`);

// Consultations API
export const requestConsultation = (data) => API.post('/api/consultations', data);
export const getMyConsultations = () => API.get('/api/consultations/my');
export const getAllConsultations = () => API.get('/api/consultations');
export const updateConsultation = (id, data) => API.put(`/api/consultations/${id}`, data);

// Admin API
export const getAdminStats = () => API.get('/api/admin/stats');
export const getAdminUsers = (params) => API.get('/api/admin/users', { params });
export const updateAdminUserRole = (id, data) => API.put(`/api/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/api/admin/users/${id}`);

export default API;

import axios from 'axios';
import { Platform } from 'react-native';

// Updated with your current local IP for phone-to-backend connectivity
// For web, we use localhost if the backend is on the same machine
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api' 
  : 'http://10.41.148.40:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;

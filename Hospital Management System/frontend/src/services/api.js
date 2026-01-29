import axios from 'axios';
import { getUserRole } from '../utils/roleUtils';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add role to headers for backend authorization)
api.interceptors.request.use(
  (config) => {
    // Add user role to request headers for backend role-based authorization
    const role = getUserRole();
    if (role) {
      config.headers['X-User-Role'] = role;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (status === 404) {
        error.message = 'API endpoint not found. Please check if the backend is running correctly.';
      } else if (status === 500) {
        error.message = 'Server error. Please try again later.';
      } else if (status === 403) {
        error.message = 'Access forbidden. Please check your permissions.';
      } else if (status === 401) {
        error.message = 'Unauthorized. Please login again.';
      }
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred';
    }
    return Promise.reject(error);
  }
);

export default api;


/**
 * API Service - Backend Communication
 * Connects to Express server with HTTPS/TLS encryption
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - uses HTTPS for encrypted communication
// For development with self-signed certs, rejectUnauthorizedCerts handles it
const API_BASE_URL = process.env.API_BASE_URL || 'https://localhost:443/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  httpsAgent: {
    // For development only - accept self-signed certificates
    rejectUnauthorizedCerts: false,
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Force HTTPS for security
    if (config.url && !config.url.startsWith('https')) {
      config.url = config.url.replace(/^http:/, 'https:');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Navigation to login handled in context
    }
    return Promise.reject(error);
  }
);

export default api;

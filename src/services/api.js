/**
 * API Service - Backend Communication
 * Connects to Express server with HTTPS/TLS encryption
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import logger from '../utils/logger';

// Base URL for API communication
// For iOS Simulator: localhost routes to host Mac
// For physical device: use your machine's local IP
// Note: Backend routes don't have /api prefix (e.g., /users/login not /api/users/login)
// Using HTTP for local development to avoid self-signed certificate issues
const API_BASE_URL = __DEV__ ? 'http://localhost:3000' : 'https://your-production-domain.com';

console.log('[API] Configured base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // For development: allow self-signed certificates
  rejectUnauthorizedCerts: false,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    // Check network connectivity before making request
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      logger.error('Network not available');
      return Promise.reject(new Error('Network not available. Please check your connection.'));
    }

    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error information
    console.error('[API Error]', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // Handle network errors
    if (!error.response) {
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        logger.error('Network error - timeout:', error.message);
        return Promise.reject(new Error('Network timeout. Please check your connection and try again.'));
      }
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        logger.error('Cannot reach server:', error.message);
        return Promise.reject(new Error(`Cannot reach server at ${API_BASE_URL}. Is the backend running?`));
      }
      if (error.message.includes('certificate')) {
        logger.error('Certificate error:', error.message);
        return Promise.reject(new Error('SSL Certificate Error - This is expected for localhost development'));
      }
      logger.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please try again.'));
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Navigation to login handled in context
    }
    return Promise.reject(error);
  }
);

export default api;

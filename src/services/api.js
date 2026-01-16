/**
 * API Service - Backend Communication
 * Connects to Express server with HTTPS/TLS encryption
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import logger from '../utils/logger';

// Base URL - uses HTTPS for encrypted communication
// For development with self-signed certs, rejectUnauthorizedCerts handles it
const API_BASE_URL = process.env.API_BASE_URL || 'https://localhost:443/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Note: httpsAgent doesn't work in React Native
  // For development with self-signed certs, configure at native level
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
    // Handle network errors
    if (!error.response) {
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        logger.error('Network error:', error);
        return Promise.reject(new Error('Network error. Please check your connection.'));
      }
      if (error.code === 'ENOTFOUND') {
        logger.error('Server not reachable:', error);
        return Promise.reject(new Error('Server not reachable. Please try again later.'));
      }
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

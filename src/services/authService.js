/**
 * Authentication Service
 * Handles user login, registration, and token management
 */

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

const authService = {
  /**
   * Register new user
   */
  register: async (email, password, name) => {
    try {
      const response = await api.post('/api/users/register', {
        email,
        password,
        firstName: name,
      });
      // Handle both new and old response formats
      const userData = response.data.data?.user || response.data.user || response.data;
      return { ...response.data, user: userData };
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      logger.log('[authService] Attempting login for:', email);
      const response = await api.post('/api/users/login', {
        email,
        password,
      });

      logger.log('[authService] Login successful');
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      logger.error('[authService] Login error:', error.message, error.response?.data);
      throw error.response?.data || { error: 'Login failed: ' + error.message };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  /**
   * Update password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Password change failed' };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  },

  /**
   * Get stored token
   */
  getToken: async () => {
    return await AsyncStorage.getItem('authToken');
  },

  /**
   * Get stored user data
   */
  getUserData: async () => {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },
};

export default authService;

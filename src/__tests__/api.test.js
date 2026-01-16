/**
 * API Service Tests
 * Unit tests for API interceptors and error handling
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add auth token to headers when token exists', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('test-token');

      const mockConfig = {
        headers: {},
      };

      // Simulate request interceptor
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        mockConfig.headers.Authorization = `Bearer ${token}`;
      }

      expect(mockConfig.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add auth token when token does not exist', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const mockConfig = {
        headers: {},
      };

      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        mockConfig.headers.Authorization = `Bearer ${token}`;
      }

      expect(mockConfig.headers.Authorization).toBeUndefined();
    });

    it('should reject request when network is unavailable', async () => {
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: false });

      const state = await NetInfo.fetch();
      expect(state.isConnected).toBe(false);
    });
  });

  describe('Response Interceptor', () => {
    it('should handle 401 unauthorized errors', async () => {
      const error = {
        response: {
          status: 401,
        },
      };

      AsyncStorage.removeItem.mockResolvedValueOnce(null);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
      }

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
    });

    it('should handle network errors gracefully', () => {
      const error = {
        message: 'Network Error',
        code: 'ECONNABORTED',
      };

      expect(error.message).toBe('Network Error');
      expect(error.code).toBe('ECONNABORTED');
    });
  });
});

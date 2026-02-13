/**
 * Auth Service Tests
 * Unit tests for authentication operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../services/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

import api from '../services/api';
import authService from '../services/authService';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token and user data', async () => {
      const mockResponse = {
        data: {
          token: 'test-jwt-token',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        },
      };
      api.post.mockResolvedValueOnce(mockResponse);
      const result = await authService.login('test@example.com', 'password123');
      expect(api.post).toHaveBeenCalledWith('/api/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'test-jwt-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockResponse.data.user)
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should not store token if response has no token', async () => {
      const mockResponse = { data: { user: { id: '1', email: 'test@example.com' } } };
      api.post.mockResolvedValueOnce(mockResponse);
      const result = await authService.login('test@example.com', 'password123');
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on login failure with response data', async () => {
      const errorData = { error: 'Invalid credentials' };
      api.post.mockRejectedValueOnce({ response: { data: errorData } });
      await expect(authService.login('test@example.com', 'wrong')).rejects.toEqual(errorData);
    });

    it('should throw generic error when no response data', async () => {
      api.post.mockRejectedValueOnce({ message: 'Network Error' });
      await expect(authService.login('test@example.com', 'pass')).rejects.toEqual({
        error: 'Login failed: Network Error',
      });
    });
  });

  describe('register', () => {
    it('should register successfully with new response format', async () => {
      const mockResponse = {
        data: { data: { user: { id: '1', email: 'new@example.com', name: 'New User' } } },
      };
      api.post.mockResolvedValueOnce(mockResponse);
      const result = await authService.register('new@example.com', 'password123', 'New User');
      expect(api.post).toHaveBeenCalledWith('/api/users/register', {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New User',
      });
      expect(result.user).toEqual(mockResponse.data.data.user);
    });

    it('should register successfully with old response format', async () => {
      const mockResponse = {
        data: { user: { id: '2', email: 'old@example.com', name: 'Old Format' } },
      };
      api.post.mockResolvedValueOnce(mockResponse);
      const result = await authService.register('old@example.com', 'password123', 'Old Format');
      expect(result.user).toEqual(mockResponse.data.user);
    });

    it('should handle direct data response format', async () => {
      const mockResponse = { data: { id: '3', email: 'direct@example.com', name: 'Direct' } };
      api.post.mockResolvedValueOnce(mockResponse);
      const result = await authService.register('direct@example.com', 'password123', 'Direct');
      expect(result.user).toEqual(mockResponse.data);
    });

    it('should throw error on registration failure', async () => {
      const errorData = { error: 'Email already exists' };
      api.post.mockRejectedValueOnce({ response: { data: errorData } });
      await expect(
        authService.register('existing@example.com', 'password123', 'Test')
      ).rejects.toEqual(errorData);
    });

    it('should throw generic error when no response data', async () => {
      api.post.mockRejectedValueOnce({ message: 'Server error' });
      await expect(
        authService.register('test@example.com', 'pass', 'Test')
      ).rejects.toEqual({ error: 'Registration failed' });
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockProfile = { id: '1', email: 'test@example.com', name: 'Test' };
      api.get.mockResolvedValueOnce({ data: mockProfile });
      const result = await authService.getProfile();
      expect(api.get).toHaveBeenCalledWith('/api/users/profile');
      expect(result).toEqual(mockProfile);
    });

    it('should throw error on profile fetch failure', async () => {
      api.get.mockRejectedValueOnce({ response: { data: { error: 'Unauthorized' } } });
      await expect(authService.getProfile()).rejects.toEqual({ error: 'Unauthorized' });
    });

    it('should throw generic error when no response data', async () => {
      api.get.mockRejectedValueOnce({ message: 'Network error' });
      await expect(authService.getProfile()).rejects.toEqual({
        error: 'Failed to fetch profile',
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockResponse = { message: 'Password updated' };
      api.post.mockResolvedValueOnce({ data: mockResponse });
      const result = await authService.changePassword('oldPass123', 'newPass456');
      expect(api.post).toHaveBeenCalledWith('/api/users/change-password', {
        currentPassword: 'oldPass123',
        newPassword: 'newPass456',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on password change failure', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { error: 'Current password incorrect' } },
      });
      await expect(authService.changePassword('wrong', 'new')).rejects.toEqual({
        error: 'Current password incorrect',
      });
    });
  });

  describe('logout', () => {
    it('should remove auth token and user data from storage', async () => {
      await authService.logout();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('getToken', () => {
    it('should return token from storage', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('stored-token');
      const token = await authService.getToken();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('authToken');
      expect(token).toBe('stored-token');
    });

    it('should return null when no token stored', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const token = await authService.getToken();
      expect(token).toBeNull();
    });
  });

  describe('getUserData', () => {
    it('should return parsed user data from storage', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test' };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));
      const result = await authService.getUserData();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userData');
      expect(result).toEqual(userData);
    });

    it('should return null when no user data stored', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const result = await authService.getUserData();
      expect(result).toBeNull();
    });
  });
});

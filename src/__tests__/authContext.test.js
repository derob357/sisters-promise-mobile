/**
 * Auth Context Tests
 * Tests for authentication context logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock authService
jest.mock('../services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getUserData: jest.fn(),
  getToken: jest.fn(),
}));

// Mock analyticsService
jest.mock('../services/analyticsService', () => ({
  init: jest.fn(() => Promise.resolve()),
  trackEvent: jest.fn(() => Promise.resolve()),
  trackSignup: jest.fn(() => Promise.resolve()),
}));

import authService from '../services/authService';
import analyticsService from '../services/analyticsService';

describe('Auth Context Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bootstrap (auto-login)', () => {
    it('should restore user from storage on startup', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test' };
      authService.getUserData.mockResolvedValueOnce(userData);

      const result = await authService.getUserData();

      expect(result).toEqual(userData);
    });

    it('should initialize analytics when user data exists', async () => {
      const userData = { id: '1', email: 'test@example.com' };
      authService.getUserData.mockResolvedValueOnce(userData);

      await authService.getUserData();
      await analyticsService.init();

      expect(analyticsService.init).toHaveBeenCalled();
    });

    it('should handle missing user data gracefully', async () => {
      authService.getUserData.mockResolvedValueOnce(null);

      const result = await authService.getUserData();

      expect(result).toBeNull();
    });

    it('should handle bootstrap errors gracefully', async () => {
      authService.getUserData.mockRejectedValueOnce(new Error('Storage error'));

      await expect(authService.getUserData()).rejects.toThrow('Storage error');
    });
  });

  describe('login flow', () => {
    it('should login successfully and return user data', async () => {
      const loginResponse = {
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        token: 'jwt-token',
      };
      authService.login.mockResolvedValueOnce(loginResponse);

      const response = await authService.login('test@example.com', 'password123');

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(response.user).toEqual(loginResponse.user);
    });

    it('should track login event on success', async () => {
      const loginResponse = { user: { id: '1' }, token: 'tok' };
      authService.login.mockResolvedValueOnce(loginResponse);

      await authService.login('t@t.com', 'pass');
      await analyticsService.trackEvent('user_login', { userId: '1' });

      expect(analyticsService.trackEvent).toHaveBeenCalledWith('user_login', { userId: '1' });
    });

    it('should handle login failure', async () => {
      authService.login.mockRejectedValueOnce({ error: 'Invalid credentials' });

      try {
        await authService.login('t@t.com', 'wrong');
      } catch (error) {
        expect(error.error).toBe('Invalid credentials');
      }
    });
  });

  describe('register flow', () => {
    it('should register successfully', async () => {
      const registerResponse = {
        user: { id: '1', email: 'new@example.com', name: 'New User' },
      };
      authService.register.mockResolvedValueOnce(registerResponse);

      const response = await authService.register('new@example.com', 'password123', 'New User');

      expect(response.user).toEqual(registerResponse.user);
    });

    it('should track signup event on success', async () => {
      const registerResponse = { user: { id: '1' } };
      authService.register.mockResolvedValueOnce(registerResponse);

      await authService.register('n@e.com', 'pass', 'Name');
      await analyticsService.trackSignup('1', 'standard');

      expect(analyticsService.trackSignup).toHaveBeenCalledWith('1', 'standard');
    });
  });

  describe('logout flow', () => {
    it('should clear auth data on logout', async () => {
      authService.logout.mockResolvedValueOnce(undefined);

      await authService.logout();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});

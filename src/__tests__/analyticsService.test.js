/**
 * Analytics Service Tests
 * Unit tests for analytics tracking operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(),
}));

import api from '../services/api';
import analyticsService from '../services/analyticsService';

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sessionId', () => {
    it('should have a session ID', () => {
      expect(analyticsService.sessionId).toBeDefined();
      expect(typeof analyticsService.sessionId).toBe('string');
      expect(analyticsService.sessionId.length).toBeGreaterThan(0);
    });

    it('should contain timestamp and random parts separated by dashes', () => {
      const parts = analyticsService.sessionId.split('-');
      expect(parts.length).toBe(3);
    });
  });

  describe('init', () => {
    it('should initialize with user data from storage', async () => {
      const userData = { id: 'user-1', role: 'standard' };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));

      await analyticsService.init();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userData');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'analyticsUserProperties',
        JSON.stringify({ userId: 'user-1', userType: 'standard' })
      );
    });

    it('should not set user properties when no user data', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      await analyticsService.init();

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle init errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      // Should not throw
      await analyticsService.init();
    });
  });

  describe('trackEvent', () => {
    it('should send event to API with session data', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackEvent('test_event', { key: 'value' });

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'test_event',
        properties: expect.objectContaining({
          key: 'value',
          sessionId: analyticsService.sessionId,
          timestamp: expect.any(String),
        }),
      });
    });

    it('should handle API errors gracefully', async () => {
      api.post.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw
      await analyticsService.trackEvent('test_event');
    });

    it('should use empty object as default event data', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackEvent('simple_event');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'simple_event',
        properties: expect.objectContaining({
          sessionId: analyticsService.sessionId,
        }),
      });
    });
  });

  describe('trackScreenView', () => {
    it('should track screen view event', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackScreenView('home');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'screen_view',
        properties: expect.objectContaining({
          screen_name: 'home',
        }),
      });
    });
  });

  describe('trackSignup', () => {
    it('should track signup event with user data', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackSignup('user-123', 'standard');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'signup',
        properties: expect.objectContaining({
          userId: 'user-123',
          userType: 'standard',
        }),
      });
    });

    it('should default to standard user type', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackSignup('user-123');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'signup',
        properties: expect.objectContaining({
          userType: 'standard',
        }),
      });
    });
  });

  describe('trackPurchase', () => {
    it('should track purchase with order data', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      const purchaseData = {
        orderId: 'order-1',
        total: 49.99,
        items: [{ id: '1', name: 'Soap', quantity: 2 }],
      };

      await analyticsService.trackPurchase(purchaseData);

      expect(api.post).toHaveBeenCalledWith('/api/analytics/purchase', {
        orderId: 'order-1',
        total: 49.99,
        items: purchaseData.items,
      });
    });

    it('should handle purchase tracking errors gracefully', async () => {
      api.post.mockRejectedValueOnce(new Error('Error'));

      await analyticsService.trackPurchase({ orderId: '1', total: 10, items: [] });
      // Should not throw
    });
  });

  describe('trackProductView', () => {
    it('should track product view with details', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackProductView('prod-1', 'Sea Moss Soap', 14.99, 'Soap');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/product', {
        productId: 'prod-1',
        action: 'view',
        properties: {
          productName: 'Sea Moss Soap',
          price: 14.99,
          category: 'Soap',
        },
      });
    });
  });

  describe('trackAddToCart', () => {
    it('should track add to cart event', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackAddToCart('prod-1', 'Sea Moss Soap', 14.99, 2);

      expect(api.post).toHaveBeenCalledWith('/api/analytics/product', {
        productId: 'prod-1',
        action: 'add_to_cart',
        properties: {
          productName: 'Sea Moss Soap',
          price: 14.99,
          quantity: 2,
        },
      });
    });
  });

  describe('trackSearch', () => {
    it('should track search with term and results count', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackSearch('soap', 5);

      expect(api.post).toHaveBeenCalledWith('/api/analytics/product', {
        action: 'search',
        properties: {
          search_term: 'soap',
          results_count: 5,
        },
      });
    });
  });

  describe('trackEmailSubscription', () => {
    it('should track email subscription event', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackEmailSubscription('newsletter');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'email_subscription',
        properties: expect.objectContaining({
          subscriptionType: 'newsletter',
        }),
      });
    });

    it('should default to newsletter type', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackEmailSubscription();

      expect(api.post).toHaveBeenCalledWith('/api/analytics/event', {
        event: 'email_subscription',
        properties: expect.objectContaining({
          subscriptionType: 'newsletter',
        }),
      });
    });
  });

  describe('trackFormSubmission', () => {
    it('should track form submission', async () => {
      api.post.mockResolvedValueOnce({ data: {} });

      await analyticsService.trackFormSubmission('contact');

      expect(api.post).toHaveBeenCalledWith('/api/analytics/form', {
        formName: 'contact',
      });
    });
  });

  describe('setUserProperties', () => {
    it('should store only safe non-PII properties', async () => {
      await analyticsService.setUserProperties({
        userId: 'user-1',
        userType: 'admin',
        email: 'should-be-removed@test.com',
        phone: '555-1234',
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'analyticsUserProperties',
        JSON.stringify({ userId: 'user-1', userType: 'admin' })
      );
    });

    it('should handle storage errors gracefully', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      // Should not throw
      await analyticsService.setUserProperties({ userId: '1', userType: 'standard' });
    });
  });
});

/**
 * Analytics Service - Mobile
 * Tracks user events to Google Analytics 4 and Apple Analytics
 */

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

/**
 * Generate a unique session ID without crypto dependency
 * Uses timestamp + random values for sufficient uniqueness
 */
const generateSessionId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${randomPart2}`;
};

const analyticsService = {
  sessionId: generateSessionId(),

  /**
   * Initialize session
   */
  init: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        analyticsService.setUserProperties({
          userId: user.id,
          userType: user.role,
        });
      }
    } catch (error) {
      logger.error('Analytics init error:', error);
    }
  },

  /**
   * Track custom event
   */
  trackEvent: async (eventName, eventData = {}) => {
    try {
      logger.log('[Analytics] Tracking event:', eventName);
      await api.post('/api/analytics/event', {
        event: eventName,
        properties: {
          ...eventData,
          sessionId: analyticsService.sessionId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error('Analytics event error:', error);
    }
  },

  /**
   * Track page/screen view
   */
  trackScreenView: async (screenName) => {
    await analyticsService.trackEvent('screen_view', {
      screen_name: screenName,
    });
  },

  /**
   * Track user signup
   */
  trackSignup: async (userId, userType = 'standard') => {
    try {
      logger.log('[Analytics] Tracking signup for user:', userId);
      await analyticsService.trackEvent('signup', {
        userId,
        userType,
      });
    } catch (error) {
      logger.error('Signup analytics error:', error);
    }
  },

  /**
   * Track purchase
   */
  trackPurchase: async (purchaseData) => {
    try {
      logger.log('[Analytics] Tracking purchase:', purchaseData.orderId);
      await api.post('/api/analytics/purchase', {
        orderId: purchaseData.orderId,
        total: purchaseData.total,
        items: purchaseData.items,
      });
    } catch (error) {
      logger.error('Purchase analytics error:', error);
    }
  },

  /**
   * Track product view
   */
  trackProductView: async (productId, productName, price, category) => {
    try {
      logger.log('[Analytics] Tracking product view:', productId);
      await api.post('/api/analytics/product', {
        productId,
        action: 'view',
        properties: {
          productName,
          price,
          category,
        },
      });
    } catch (error) {
      logger.error('Product view analytics error:', error);
    }
  },

  /**
   * Track add to cart
   */
  trackAddToCart: async (productId, productName, price, quantity) => {
    try {
      logger.log('[Analytics] Tracking add to cart:', productId);
      await api.post('/api/analytics/product', {
        productId,
        action: 'add_to_cart',
        properties: {
          productName,
          price,
          quantity,
        },
      });
    } catch (error) {
      logger.error('Add to cart analytics error:', error);
    }
  },

  /**
   * Track search
   */
  trackSearch: async (searchTerm, resultsCount) => {
    try {
      logger.log('[Analytics] Tracking search:', searchTerm);
      await api.post('/api/analytics/product', {
        action: 'search',
        properties: {
          search_term: searchTerm,
          results_count: resultsCount,
        },
      });
    } catch (error) {
      logger.error('Search analytics error:', error);
    }
  },

  /**
   * Track email subscription
   */
  trackEmailSubscription: async (subscriptionType = 'newsletter') => {
    try {
      logger.log('[Analytics] Tracking email subscription:', subscriptionType);
      // Don't track raw email - GDPR/CCPA compliance
      await analyticsService.trackEvent('email_subscription', {
        subscriptionType,
      });
    } catch (error) {
      logger.error('Email subscription analytics error:', error);
    }
  },

  /**
   * Track form submission
   */
  trackFormSubmission: async (formName) => {
    try {
      await api.post('/api/analytics/form', {
        formName,
      });
    } catch (error) {
      logger.error('Form submission analytics error:', error);
    }
  },

  /**
   * Set user properties - no PII (GDPR/CCPA compliant)
   */
  setUserProperties: async (properties) => {
    try {
      // Only store non-PII properties
      const safeProperties = {
        userId: properties.userId,
        userType: properties.userType,
        // Remove: userEmail, email, phone, address
      };
      await AsyncStorage.setItem('analyticsUserProperties', JSON.stringify(safeProperties));
    } catch (error) {
      logger.error('Analytics user properties error:', error);
    }
  },
};

export default analyticsService;

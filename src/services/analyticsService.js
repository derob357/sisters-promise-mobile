/**
 * Analytics Service - Mobile
 * Tracks user events to Google Analytics 4 and Apple Analytics
 */

import api from './api';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

const analyticsService = {
  sessionId: uuidv4(),

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
      await api.post('/analytics/event', {
        eventName,
        eventData: {
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
      await api.post('/analytics/signup', {
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
      await api.post('/analytics/purchase', {
        ...purchaseData,
        sessionId: analyticsService.sessionId,
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
      await api.post('/analytics/product', {
        action: 'view',
        productId,
        productName,
        price,
        category,
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
      await api.post('/analytics/product', {
        action: 'add_to_cart',
        productId,
        productName,
        price,
        quantity,
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
      await api.post('/analytics/product', {
        action: 'search',
        search_term: searchTerm,
        results_count: resultsCount,
      });
    } catch (error) {
      logger.error('Search analytics error:', error);
    }
  },

  /**
   * Track email subscription
   */
  trackEmailSubscription: async (email, subscriptionType = 'newsletter') => {
    try {
      await api.post('/analytics/email-subscription', {
        email,
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
      await api.post('/analytics/form', {
        formName,
      });
    } catch (error) {
      logger.error('Form submission analytics error:', error);
    }
  },

  /**
   * Set user properties
   */
  setUserProperties: async (properties) => {
    try {
      await AsyncStorage.setItem('analyticsUserProperties', JSON.stringify(properties));
    } catch (error) {
      logger.error('Analytics user properties error:', error);
    }
  },
};

export default analyticsService;

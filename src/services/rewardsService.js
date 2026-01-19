/**
 * Rewards Service
 * Handles API calls for rewards, special offers, and bundles
 */

import api from './api';
import logger from '../utils/logger';

const rewardsService = {
  /**
   * Get user's rewards data
   */
  getUserRewards: async () => {
    try {
      const response = await api.get('/api/rewards/user');
      return response.data;
    } catch (error) {
      logger.error('Get user rewards error:', error);
      // Return default rewards structure if API fails
      return {
        points: 0,
        totalPurchases: 0,
        freeGiftsEarned: 0,
        freeGiftsRedeemed: 0,
        lifetimePoints: 0,
      };
    }
  },

  /**
   * Update rewards after a purchase
   */
  updateRewards: async ({ pointsEarned, purchaseAmount, purchaseCount }) => {
    try {
      const response = await api.post('/api/rewards/update', {
        pointsEarned,
        purchaseAmount,
        purchaseCount,
      });
      return response.data;
    } catch (error) {
      logger.error('Update rewards error:', error);
      throw error;
    }
  },

  /**
   * Redeem a free gift
   */
  redeemFreeGift: async () => {
    try {
      const response = await api.post('/api/rewards/redeem-gift');
      return response.data;
    } catch (error) {
      logger.error('Redeem free gift error:', error);
      throw error;
    }
  },

  /**
   * Redeem points for discount
   */
  redeemPoints: async (points) => {
    try {
      const response = await api.post('/api/rewards/redeem-points', { points });
      return response.data;
    } catch (error) {
      logger.error('Redeem points error:', error);
      throw error;
    }
  },

  /**
   * Get special offers (BOGO deals, etc.)
   */
  getSpecialOffers: async () => {
    try {
      const response = await api.get('/api/rewards/offers');
      return response.data;
    } catch (error) {
      logger.error('Get special offers error:', error);
      return [];
    }
  },

  /**
   * Get product bundles
   */
  getBundles: async () => {
    try {
      const response = await api.get('/api/rewards/bundles');
      return response.data;
    } catch (error) {
      logger.error('Get bundles error:', error);
      return [];
    }
  },

  /**
   * Get bundle details with full product info
   */
  getBundleDetails: async (bundleId) => {
    try {
      const response = await api.get(`/api/rewards/bundles/${bundleId}`);
      return response.data;
    } catch (error) {
      logger.error('Get bundle details error:', error);
      throw error;
    }
  },

  /**
   * Apply BOGO offer to cart
   */
  applyBogoOffer: async (offerId, productId) => {
    try {
      const response = await api.post('/api/rewards/apply-bogo', {
        offerId,
        productId,
      });
      return response.data;
    } catch (error) {
      logger.error('Apply BOGO offer error:', error);
      throw error;
    }
  },

  /**
   * Get rewards history
   */
  getRewardsHistory: async () => {
    try {
      const response = await api.get('/api/rewards/history');
      return response.data;
    } catch (error) {
      logger.error('Get rewards history error:', error);
      return [];
    }
  },

  /**
   * Get available free gift products
   */
  getFreeGiftOptions: async () => {
    try {
      const response = await api.get('/api/rewards/free-gifts');
      return response.data;
    } catch (error) {
      logger.error('Get free gift options error:', error);
      return [];
    }
  },
};

export default rewardsService;

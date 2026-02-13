/**
 * Rewards Service Tests
 * Unit tests for rewards API operations
 */

jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import api from '../services/api';
import rewardsService from '../services/rewardsService';

describe('Rewards Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRewards', () => {
    it('should fetch user rewards', async () => {
      const rewards = { points: 100, totalPurchases: 5 };
      api.get.mockResolvedValueOnce({ data: rewards });
      const result = await rewardsService.getUserRewards();
      expect(api.get).toHaveBeenCalledWith('/api/rewards/user');
      expect(result).toEqual(rewards);
    });

    it('should return default rewards on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await rewardsService.getUserRewards();
      expect(result).toEqual({
        points: 0,
        totalPurchases: 0,
        freeGiftsEarned: 0,
        freeGiftsRedeemed: 0,
        lifetimePoints: 0,
      });
    });
  });

  describe('updateRewards', () => {
    it('should update rewards after purchase', async () => {
      const updateData = { pointsEarned: 50, purchaseAmount: 25.00, purchaseCount: 1 };
      api.post.mockResolvedValueOnce({ data: { success: true } });
      const result = await rewardsService.updateRewards(updateData);
      expect(api.post).toHaveBeenCalledWith('/api/rewards/update', updateData);
      expect(result).toEqual({ success: true });
    });

    it('should throw error on failure', async () => {
      api.post.mockRejectedValueOnce(new Error('Failed'));
      await expect(rewardsService.updateRewards({})).rejects.toThrow('Failed');
    });
  });

  describe('redeemFreeGift', () => {
    it('should redeem free gift', async () => {
      api.post.mockResolvedValueOnce({ data: { success: true } });
      const result = await rewardsService.redeemFreeGift();
      expect(api.post).toHaveBeenCalledWith('/api/rewards/redeem-gift');
      expect(result).toEqual({ success: true });
    });

    it('should throw error on failure', async () => {
      api.post.mockRejectedValueOnce(new Error('No gifts'));
      await expect(rewardsService.redeemFreeGift()).rejects.toThrow('No gifts');
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points for discount', async () => {
      api.post.mockResolvedValueOnce({ data: { discount: 5.00 } });
      const result = await rewardsService.redeemPoints(500);
      expect(api.post).toHaveBeenCalledWith('/api/rewards/redeem-points', { points: 500 });
      expect(result).toEqual({ discount: 5.00 });
    });
  });

  describe('getSpecialOffers', () => {
    it('should fetch special offers', async () => {
      const offers = [{ id: '1', type: 'bogo' }];
      api.get.mockResolvedValueOnce({ data: offers });
      const result = await rewardsService.getSpecialOffers();
      expect(result).toEqual(offers);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await rewardsService.getSpecialOffers();
      expect(result).toEqual([]);
    });
  });

  describe('getBundles', () => {
    it('should fetch product bundles', async () => {
      const bundles = [{ id: '1', name: 'Sample Bundle' }];
      api.get.mockResolvedValueOnce({ data: bundles });
      const result = await rewardsService.getBundles();
      expect(result).toEqual(bundles);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await rewardsService.getBundles();
      expect(result).toEqual([]);
    });
  });

  describe('getBundleDetails', () => {
    it('should fetch bundle details by ID', async () => {
      const bundle = { id: '1', name: 'Bundle', items: [] };
      api.get.mockResolvedValueOnce({ data: bundle });
      const result = await rewardsService.getBundleDetails('1');
      expect(api.get).toHaveBeenCalledWith('/api/rewards/bundles/1');
      expect(result).toEqual(bundle);
    });

    it('should throw error on failure', async () => {
      api.get.mockRejectedValueOnce(new Error('Not found'));
      await expect(rewardsService.getBundleDetails('999')).rejects.toThrow('Not found');
    });
  });

  describe('applyBogoOffer', () => {
    it('should apply BOGO offer', async () => {
      api.post.mockResolvedValueOnce({ data: { applied: true } });
      const result = await rewardsService.applyBogoOffer('offer-1', 'prod-1');
      expect(api.post).toHaveBeenCalledWith('/api/rewards/apply-bogo', {
        offerId: 'offer-1',
        productId: 'prod-1',
      });
      expect(result).toEqual({ applied: true });
    });

    it('should throw error on failure', async () => {
      api.post.mockRejectedValueOnce(new Error('Invalid offer'));
      await expect(rewardsService.applyBogoOffer('bad', 'prod')).rejects.toThrow('Invalid offer');
    });
  });

  describe('getRewardsHistory', () => {
    it('should fetch rewards history', async () => {
      const history = [{ action: 'earned', points: 50 }];
      api.get.mockResolvedValueOnce({ data: history });
      const result = await rewardsService.getRewardsHistory();
      expect(result).toEqual(history);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await rewardsService.getRewardsHistory();
      expect(result).toEqual([]);
    });
  });

  describe('getFreeGiftOptions', () => {
    it('should fetch free gift options', async () => {
      const gifts = [{ id: '1', name: 'Sample Soap' }];
      api.get.mockResolvedValueOnce({ data: gifts });
      const result = await rewardsService.getFreeGiftOptions();
      expect(result).toEqual(gifts);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await rewardsService.getFreeGiftOptions();
      expect(result).toEqual([]);
    });
  });
});

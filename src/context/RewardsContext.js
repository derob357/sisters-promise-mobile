/**
 * Rewards Context
 * Manages customer rewards, points, and loyalty program state
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import rewardsService from '../services/rewardsService';
import logger from '../utils/logger';

const REWARDS_STORAGE_KEY = 'sisters_promise_rewards';

// Reward tiers configuration
export const REWARD_TIERS = {
  BRONZE: { name: 'Bronze', minPurchases: 0, pointsMultiplier: 1, color: '#CD7F32' },
  SILVER: { name: 'Silver', minPurchases: 5, pointsMultiplier: 1.5, color: '#C0C0C0' },
  GOLD: { name: 'Gold', minPurchases: 10, pointsMultiplier: 2, color: '#FFD700' },
  PLATINUM: { name: 'Platinum', minPurchases: 20, pointsMultiplier: 3, color: '#E5E4E2' },
};

// Free gift thresholds
export const FREE_GIFT_THRESHOLD = 10; // Every 10 purchases = free gift
export const POINTS_PER_DOLLAR = 10; // 10 points per dollar spent

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [rewards, setRewards] = useState({
    points: 0,
    totalPurchases: 0,
    purchasesUntilFreeGift: FREE_GIFT_THRESHOLD,
    tier: 'BRONZE',
    freeGiftsEarned: 0,
    freeGiftsRedeemed: 0,
    lifetimePoints: 0,
    lastUpdated: null,
  });

  const [specialOffers, setSpecialOffers] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate current tier based on total purchases
  const calculateTier = useCallback((totalPurchases) => {
    if (totalPurchases >= REWARD_TIERS.PLATINUM.minPurchases) return 'PLATINUM';
    if (totalPurchases >= REWARD_TIERS.GOLD.minPurchases) return 'GOLD';
    if (totalPurchases >= REWARD_TIERS.SILVER.minPurchases) return 'SILVER';
    return 'BRONZE';
  }, []);

  // Calculate purchases until next free gift
  const calculatePurchasesUntilFreeGift = useCallback((totalPurchases) => {
    const purchasesInCurrentCycle = totalPurchases % FREE_GIFT_THRESHOLD;
    return FREE_GIFT_THRESHOLD - purchasesInCurrentCycle;
  }, []);

  // Load rewards from storage/API
  const loadRewards = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get from API first
      const apiRewards = await rewardsService.getUserRewards();

      if (apiRewards) {
        const tier = calculateTier(apiRewards.totalPurchases || 0);
        const purchasesUntilFreeGift = calculatePurchasesUntilFreeGift(apiRewards.totalPurchases || 0);

        const updatedRewards = {
          ...apiRewards,
          tier,
          purchasesUntilFreeGift,
          lastUpdated: new Date().toISOString(),
        };

        setRewards(updatedRewards);
        await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));
      }
    } catch (err) {
      logger.error('Failed to load rewards from API:', err);

      // Fallback to local storage
      try {
        const storedRewards = await AsyncStorage.getItem(REWARDS_STORAGE_KEY);
        if (storedRewards) {
          setRewards(JSON.parse(storedRewards));
        }
      } catch (storageErr) {
        logger.error('Failed to load rewards from storage:', storageErr);
        setError('Unable to load rewards');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, calculateTier, calculatePurchasesUntilFreeGift]);

  // Load special offers (BOGO deals)
  const loadSpecialOffers = useCallback(async () => {
    try {
      const offers = await rewardsService.getSpecialOffers();
      setSpecialOffers(offers || []);
    } catch (err) {
      logger.error('Failed to load special offers:', err);
      // Use default offers if API fails
      setSpecialOffers(getDefaultOffers());
    }
  }, []);

  // Load bundles
  const loadBundles = useCallback(async () => {
    try {
      const bundleData = await rewardsService.getBundles();
      setBundles(bundleData || []);
    } catch (err) {
      logger.error('Failed to load bundles:', err);
      // Use default bundles if API fails
      setBundles(getDefaultBundles());
    }
  }, []);

  // Add points from a purchase
  const addPoints = useCallback(async (purchaseAmount, purchaseCount = 1) => {
    const tierMultiplier = REWARD_TIERS[rewards.tier]?.pointsMultiplier || 1;
    const pointsEarned = Math.floor(purchaseAmount * POINTS_PER_DOLLAR * tierMultiplier);

    const newTotalPurchases = rewards.totalPurchases + purchaseCount;
    const newTier = calculateTier(newTotalPurchases);
    const newPurchasesUntilFreeGift = calculatePurchasesUntilFreeGift(newTotalPurchases);

    // Check if a free gift was earned
    const previousGiftsEarned = Math.floor(rewards.totalPurchases / FREE_GIFT_THRESHOLD);
    const newGiftsEarned = Math.floor(newTotalPurchases / FREE_GIFT_THRESHOLD);
    const giftJustEarned = newGiftsEarned > previousGiftsEarned;

    const updatedRewards = {
      ...rewards,
      points: rewards.points + pointsEarned,
      totalPurchases: newTotalPurchases,
      tier: newTier,
      purchasesUntilFreeGift: newPurchasesUntilFreeGift,
      freeGiftsEarned: newGiftsEarned,
      lifetimePoints: rewards.lifetimePoints + pointsEarned,
      lastUpdated: new Date().toISOString(),
    };

    setRewards(updatedRewards);
    await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));

    // Sync with backend
    try {
      await rewardsService.updateRewards({
        pointsEarned,
        purchaseAmount,
        purchaseCount,
      });
    } catch (err) {
      logger.error('Failed to sync rewards with backend:', err);
    }

    return { pointsEarned, giftJustEarned, newTier };
  }, [rewards, calculateTier, calculatePurchasesUntilFreeGift]);

  // Redeem a free gift
  const redeemFreeGift = useCallback(async () => {
    if (rewards.freeGiftsEarned <= rewards.freeGiftsRedeemed) {
      return { success: false, message: 'No free gifts available' };
    }

    const updatedRewards = {
      ...rewards,
      freeGiftsRedeemed: rewards.freeGiftsRedeemed + 1,
      lastUpdated: new Date().toISOString(),
    };

    setRewards(updatedRewards);
    await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));

    try {
      await rewardsService.redeemFreeGift();
    } catch (err) {
      logger.error('Failed to redeem free gift on backend:', err);
    }

    return { success: true, message: 'Free gift redeemed!' };
  }, [rewards]);

  // Redeem points
  const redeemPoints = useCallback(async (pointsToRedeem) => {
    if (pointsToRedeem > rewards.points) {
      return { success: false, message: 'Not enough points' };
    }

    const updatedRewards = {
      ...rewards,
      points: rewards.points - pointsToRedeem,
      lastUpdated: new Date().toISOString(),
    };

    setRewards(updatedRewards);
    await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));

    try {
      await rewardsService.redeemPoints(pointsToRedeem);
    } catch (err) {
      logger.error('Failed to redeem points on backend:', err);
    }

    return { success: true, discount: pointsToRedeem / 100 }; // 100 points = $1
  }, [rewards]);

  // Get available free gifts count
  const getAvailableFreeGifts = useCallback(() => {
    return rewards.freeGiftsEarned - rewards.freeGiftsRedeemed;
  }, [rewards]);

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      loadRewards();
      loadSpecialOffers();
      loadBundles();
    } else {
      // Reset rewards when logged out
      setRewards({
        points: 0,
        totalPurchases: 0,
        purchasesUntilFreeGift: FREE_GIFT_THRESHOLD,
        tier: 'BRONZE',
        freeGiftsEarned: 0,
        freeGiftsRedeemed: 0,
        lifetimePoints: 0,
        lastUpdated: null,
      });
      setSpecialOffers([]);
      setBundles([]);
    }
  }, [user?.id, loadRewards, loadSpecialOffers, loadBundles]);

  const value = {
    rewards,
    specialOffers,
    bundles,
    loading,
    error,
    addPoints,
    redeemFreeGift,
    redeemPoints,
    getAvailableFreeGifts,
    loadRewards,
    loadSpecialOffers,
    loadBundles,
    REWARD_TIERS,
    FREE_GIFT_THRESHOLD,
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
};

// Default offers when API is unavailable
const getDefaultOffers = () => [
  {
    id: 'bogo-seamoss',
    type: 'bogo',
    title: 'Buy 1 Get 1 FREE',
    description: 'Sea Moss Soap - Buy one, get one free!',
    productCategory: 'Sea Moss',
    discountPercent: 100,
    minQuantity: 1,
    active: true,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bogo-any',
    type: 'bogo',
    title: 'Weekend Special',
    description: 'Buy any 2 soaps, get the 3rd 50% off!',
    productCategory: 'All',
    discountPercent: 50,
    minQuantity: 2,
    active: true,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Default bundles when API is unavailable
const getDefaultBundles = () => [
  {
    id: 'bundle-sampler',
    name: 'Sisters Sampler Bundle',
    description: 'Try our best sellers! Includes Pink Soap, Kush Soap, and Sea Moss Soap.',
    items: [
      { name: 'Pink Soap', quantity: 1, originalPrice: 12.99 },
      { name: 'Kush Soap', quantity: 1, originalPrice: 12.99 },
      { name: 'Sea Moss Soap', quantity: 1, originalPrice: 14.99 },
    ],
    originalPrice: 40.97,
    bundlePrice: 32.99,
    savings: 7.98,
    savingsPercent: 19,
    image: null,
    active: true,
  },
  {
    id: 'bundle-seamoss-3',
    name: 'Sea Moss Triple Pack',
    description: 'Stock up on our popular Sea Moss Soap! 3 bars at a great price.',
    items: [
      { name: 'Sea Moss Soap', quantity: 3, originalPrice: 44.97 },
    ],
    originalPrice: 44.97,
    bundlePrice: 36.99,
    savings: 7.98,
    savingsPercent: 18,
    image: null,
    active: true,
  },
  {
    id: 'bundle-mix-10',
    name: 'Mix & Match 10-Pack',
    description: 'Choose any 10 soaps and save big! Perfect for gifts or stocking up.',
    items: [
      { name: 'Any Soap (Your Choice)', quantity: 10, originalPrice: 129.90 },
    ],
    originalPrice: 129.90,
    bundlePrice: 89.99,
    savings: 39.91,
    savingsPercent: 31,
    image: null,
    active: true,
    isCustomizable: true,
  },
];

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};

export default RewardsContext;

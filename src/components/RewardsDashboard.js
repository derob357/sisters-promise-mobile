/**
 * Rewards Dashboard Component
 * Displays user's rewards progress, points, and tier on the home screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRewards, REWARD_TIERS, FREE_GIFT_THRESHOLD } from '../context/RewardsContext';

const RewardsDashboard = ({ onPress }) => {
  const { rewards, loading, getAvailableFreeGifts } = useRewards();
  const availableGifts = getAvailableFreeGifts();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingPlaceholder} />
      </View>
    );
  }

  const tierInfo = REWARD_TIERS[rewards.tier] || REWARD_TIERS.BRONZE;
  const progressPercent = ((FREE_GIFT_THRESHOLD - rewards.purchasesUntilFreeGift) / FREE_GIFT_THRESHOLD) * 100;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Header with tier badge */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Icon name="gift" size={24} color="#4CAF50" />
          <Text style={styles.title}>Your Rewards</Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
          <Icon name="crown" size={14} color="#FFF" />
          <Text style={styles.tierText}>{tierInfo.name}</Text>
        </View>
      </View>

      {/* Points display */}
      <View style={styles.pointsSection}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{rewards.points.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>Points</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{rewards.totalPurchases}</Text>
          <Text style={styles.pointsLabel}>Purchases</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{tierInfo.pointsMultiplier}x</Text>
          <Text style={styles.pointsLabel}>Multiplier</Text>
        </View>
      </View>

      {/* Progress to free gift */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Icon name="gift-outline" size={18} color="#4CAF50" />
          <Text style={styles.progressTitle}>Progress to Free Gift</Text>
          <Text style={styles.progressCount}>
            {FREE_GIFT_THRESHOLD - rewards.purchasesUntilFreeGift}/{FREE_GIFT_THRESHOLD}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
          {/* Progress markers */}
          <View style={styles.progressMarkers}>
            {[...Array(FREE_GIFT_THRESHOLD)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.marker,
                  i < FREE_GIFT_THRESHOLD - rewards.purchasesUntilFreeGift && styles.markerFilled,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.progressText}>
          {rewards.purchasesUntilFreeGift === 0
            ? 'You earned a FREE gift!'
            : `${rewards.purchasesUntilFreeGift} more purchase${rewards.purchasesUntilFreeGift !== 1 ? 's' : ''} until your free gift!`}
        </Text>
      </View>

      {/* Available free gifts notification */}
      {availableGifts > 0 && (
        <View style={styles.freeGiftAlert}>
          <Icon name="party-popper" size={20} color="#FFF" />
          <Text style={styles.freeGiftAlertText}>
            You have {availableGifts} free gift{availableGifts !== 1 ? 's' : ''} to redeem!
          </Text>
          <Icon name="chevron-right" size={20} color="#FFF" />
        </View>
      )}

      {/* Tap to view more */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap to view rewards details</Text>
        <Icon name="chevron-right" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingPlaceholder: {
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  pointsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  pointsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  markerFilled: {
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  freeGiftAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  freeGiftAlertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default RewardsDashboard;

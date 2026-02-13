/**
 * Rewards Screen - Full rewards profile with tabs for Gifts, Offers, Bundles, Redeem
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Spinner } from '../components/CommonComponents';
import { useRewards, REWARD_TIERS, FREE_GIFT_THRESHOLD } from '../context/RewardsContext';
import rewardsService from '../services/rewardsService';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

const TABS = ['Gifts', 'Offers', 'Bundles', 'Redeem'];

const RewardsScreen = ({ navigation }) => {
  const {
    rewards,
    specialOffers,
    bundles,
    loading,
    getAvailableFreeGifts,
    redeemFreeGift,
    redeemPoints,
    loadRewards,
  } = useRewards();

  const [activeTab, setActiveTab] = useState('Gifts');
  const [refreshing, setRefreshing] = useState(false);
  const [freeGiftOptions, setFreeGiftOptions] = useState([]);
  const [giftOptionsLoading, setGiftOptionsLoading] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState('');

  const availableGifts = getAvailableFreeGifts();
  const tierInfo = REWARD_TIERS[rewards.tier] || REWARD_TIERS.BRONZE;
  const progressPercent = ((FREE_GIFT_THRESHOLD - rewards.purchasesUntilFreeGift) / FREE_GIFT_THRESHOLD) * 100;

  useEffect(() => {
    analyticsService.trackScreenView('rewards');
    loadFreeGiftOptions();
  }, []);

  const loadFreeGiftOptions = async () => {
    setGiftOptionsLoading(true);
    try {
      const options = await rewardsService.getFreeGiftOptions();
      setFreeGiftOptions(options || []);
    } catch (err) {
      logger.error('Failed to load free gift options:', err);
      setFreeGiftOptions([]);
    } finally {
      setGiftOptionsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadRewards(), loadFreeGiftOptions()]);
    setRefreshing(false);
  }, [loadRewards]);

  const handleRedeemGift = async () => {
    const result = await redeemFreeGift();
    if (result.success) {
      Alert.alert('Congratulations!', result.message, [{ text: 'OK' }]);
      analyticsService.trackEvent('free_gift_redeemed', { giftsRemaining: availableGifts - 1 });
      await loadRewards();
    } else {
      Alert.alert('Unable to Redeem', result.message, [{ text: 'OK' }]);
    }
  };

  const handleRedeemPoints = async () => {
    const points = parseInt(pointsToRedeem, 10);
    if (!points || points <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number of points to redeem.', [{ text: 'OK' }]);
      return;
    }
    if (points > rewards.points) {
      Alert.alert('Not Enough Points', `You only have ${rewards.points.toLocaleString()} points available.`, [{ text: 'OK' }]);
      return;
    }

    const result = await redeemPoints(points);
    if (result.success) {
      Alert.alert(
        'Points Redeemed!',
        `You redeemed ${points.toLocaleString()} points for a $${result.discount.toFixed(2)} discount.`,
        [{ text: 'OK' }],
      );
      analyticsService.trackEvent('points_redeemed', { points, discount: result.discount });
      setPointsToRedeem('');
      await loadRewards();
    } else {
      Alert.alert('Redemption Failed', result.message || 'Please try again later.', [{ text: 'OK' }]);
    }
  };

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      {/* Tier Badge */}
      <View style={styles.profileHeader}>
        <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
          <Icon name="crown" size={16} color="#FFF" />
          <Text style={styles.tierBadgeText}>{tierInfo.name}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{rewards.points.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{rewards.totalPurchases}</Text>
          <Text style={styles.statLabel}>Purchases</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{tierInfo.pointsMultiplier}x</Text>
          <Text style={styles.statLabel}>Multiplier</Text>
        </View>
      </View>

      {/* Lifetime Points */}
      <View style={styles.lifetimeRow}>
        <Icon name="star-outline" size={14} color="#999" />
        <Text style={styles.lifetimeText}>
          Lifetime Points: {rewards.lifetimePoints.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => setActiveTab(tab)}
          accessibilityLabel={`${tab} tab`}
          accessibilityRole="button"
          accessibilityState={{ selected: activeTab === tab }}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGiftsTab = () => (
    <View style={styles.tabContent}>
      {/* Progress Section */}
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <Icon name="gift-outline" size={20} color="#4CAF50" />
          <Text style={styles.progressTitle}>Progress to Free Gift</Text>
          <Text style={styles.progressCount}>
            {FREE_GIFT_THRESHOLD - rewards.purchasesUntilFreeGift}/{FREE_GIFT_THRESHOLD}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
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

      {/* Available Free Gifts Alert */}
      {availableGifts > 0 && (
        <View style={styles.freeGiftAlert}>
          <Icon name="party-popper" size={20} color="#FFF" />
          <Text style={styles.freeGiftAlertText}>
            You have {availableGifts} free gift{availableGifts !== 1 ? 's' : ''} to redeem!
          </Text>
        </View>
      )}

      {/* Free Gift Options */}
      <Text style={styles.sectionTitle}>Available Gift Options</Text>
      {giftOptionsLoading ? (
        <Spinner />
      ) : freeGiftOptions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="gift-off-outline" size={40} color="#CCC" />
          <Text style={styles.emptyText}>No gift options available right now</Text>
        </View>
      ) : (
        freeGiftOptions.map((gift, index) => (
          <View key={gift.id || `gift-${index}`} style={styles.card}>
            <Text style={styles.giftName}>{gift.name}</Text>
            <Text style={styles.giftDescription}>{gift.description}</Text>
            {gift.value && (
              <Text style={styles.giftValue}>Value: ${gift.value.toFixed(2)}</Text>
            )}
            {availableGifts > 0 && (
              <TouchableOpacity
                style={styles.redeemGiftButton}
                onPress={handleRedeemGift}
                accessibilityLabel={`Redeem ${gift.name}`}
                accessibilityRole="button"
              >
                <Icon name="gift" size={18} color="#FFF" />
                <Text style={styles.redeemGiftButtonText}>Redeem Gift</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderOffersTab = () => (
    <View style={styles.tabContent}>
      {!specialOffers || specialOffers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="tag-off-outline" size={40} color="#CCC" />
          <Text style={styles.emptyText}>No special offers available right now</Text>
        </View>
      ) : (
        specialOffers.map((offer, index) => (
          <View key={offer.id || `offer-${index}`} style={styles.card}>
            <View style={styles.offerHeader}>
              <View style={styles.offerTypeBadge}>
                <Text style={styles.offerTypeBadgeText}>
                  {(offer.type || 'deal').toUpperCase()}
                </Text>
              </View>
              {offer.discountPercent && (
                <Text style={styles.offerDiscount}>{offer.discountPercent}% OFF</Text>
              )}
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDescription}>{offer.description}</Text>
            {offer.productCategory && (
              <View style={styles.offerMeta}>
                <Icon name="tag" size={14} color="#999" />
                <Text style={styles.offerMetaText}>Category: {offer.productCategory}</Text>
              </View>
            )}
            {offer.validUntil && (
              <View style={styles.offerMeta}>
                <Icon name="clock-outline" size={14} color="#999" />
                <Text style={styles.offerMetaText}>
                  Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderBundlesTab = () => (
    <View style={styles.tabContent}>
      {!bundles || bundles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="package-variant" size={40} color="#CCC" />
          <Text style={styles.emptyText}>No bundles available right now</Text>
        </View>
      ) : (
        bundles.map((bundle, index) => (
          <View key={bundle.id || `bundle-${index}`} style={styles.card}>
            <View style={styles.bundleHeader}>
              <Text style={styles.bundleName}>{bundle.name}</Text>
              {bundle.savingsPercent > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>Save {bundle.savingsPercent}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.bundleDescription}>{bundle.description}</Text>

            {/* Items List */}
            {bundle.items && bundle.items.length > 0 && (
              <View style={styles.bundleItemsList}>
                {bundle.items.map((item, itemIndex) => (
                  <View key={`item-${itemIndex}`} style={styles.bundleItem}>
                    <Icon name="check-circle" size={14} color="#4CAF50" />
                    <Text style={styles.bundleItemText}>
                      {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Pricing */}
            <View style={styles.bundlePricing}>
              <Text style={styles.bundleOriginalPrice}>
                ${bundle.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.bundlePrice}>
                ${bundle.bundlePrice.toFixed(2)}
              </Text>
              <Text style={styles.bundleSavings}>
                You save ${bundle.savings.toFixed(2)}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderRedeemTab = () => {
    const numericPoints = parseInt(pointsToRedeem, 10) || 0;
    const calculatedDiscount = (numericPoints / 100).toFixed(2);
    const canRedeem = numericPoints > 0 && numericPoints <= rewards.points;

    return (
      <View style={styles.tabContent}>
        {/* Points Balance */}
        <View style={styles.card}>
          <View style={styles.redeemBalanceSection}>
            <Icon name="star-circle" size={40} color="#4CAF50" />
            <Text style={styles.redeemBalanceValue}>{rewards.points.toLocaleString()}</Text>
            <Text style={styles.redeemBalanceLabel}>Available Points</Text>
          </View>
        </View>

        {/* Conversion Rate */}
        <View style={styles.card}>
          <View style={styles.conversionRow}>
            <Icon name="swap-horizontal" size={20} color="#4CAF50" />
            <Text style={styles.conversionText}>100 points = $1.00 discount</Text>
          </View>
        </View>

        {/* Redeem Input */}
        <View style={styles.card}>
          <Text style={styles.redeemInputLabel}>Points to Redeem</Text>
          <TextInput
            style={styles.redeemInput}
            value={pointsToRedeem}
            onChangeText={setPointsToRedeem}
            placeholder="Enter points amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

          {numericPoints > 0 && (
            <View style={styles.discountPreview}>
              <Text style={styles.discountPreviewLabel}>Discount Value:</Text>
              <Text style={styles.discountPreviewValue}>${calculatedDiscount}</Text>
            </View>
          )}

          {numericPoints > rewards.points && (
            <Text style={styles.redeemError}>
              You don't have enough points. Maximum: {rewards.points.toLocaleString()}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.redeemButton, !canRedeem && styles.redeemButtonDisabled]}
            onPress={handleRedeemPoints}
            disabled={!canRedeem}
            accessibilityLabel="Redeem points for discount"
            accessibilityRole="button"
          >
            <Icon name="cash-multiple" size={20} color="#FFF" />
            <Text style={styles.redeemButtonText}>Redeem Points</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Gifts':
        return renderGiftsTab();
      case 'Offers':
        return renderOffersTab();
      case 'Bundles':
        return renderBundlesTab();
      case 'Redeem':
        return renderRedeemTab();
      default:
        return renderGiftsTab();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Header title="My Rewards" onBackPress={() => navigation.goBack()} />
        <Spinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header title="My Rewards" onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderProfileCard()}
        {renderTabBar()}
        {renderActiveTab()}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tierBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  lifetimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  lifetimeText: {
    fontSize: 13,
    color: '#999',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFF',
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 16,
  },

  // Shared Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 12,
  },

  // Progress (Gifts Tab)
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

  // Free Gift Alert
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

  // Gift Cards
  giftName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  giftDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  giftValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  redeemGiftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  redeemGiftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },

  // Offers Tab
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  offerTypeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF50',
  },
  offerDiscount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  offerMetaText: {
    fontSize: 12,
    color: '#999',
  },

  // Bundles Tab
  bundleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bundleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  savingsBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  bundleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  bundleItemsList: {
    marginBottom: 12,
  },
  bundleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  bundleItemText: {
    fontSize: 13,
    color: '#333',
  },
  bundlePricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bundleOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bundlePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  bundleSavings: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  // Redeem Tab
  redeemBalanceSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  redeemBalanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  redeemBalanceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  conversionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  redeemInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  redeemInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  discountPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  discountPreviewLabel: {
    fontSize: 14,
    color: '#333',
  },
  discountPreviewValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  redeemError: {
    fontSize: 13,
    color: '#FF6B6B',
    marginTop: 8,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  redeemButtonDisabled: {
    opacity: 0.6,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 32,
  },
});

export default RewardsScreen;

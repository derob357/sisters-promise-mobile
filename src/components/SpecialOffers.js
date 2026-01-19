/**
 * Special Offers Components
 * BOGO badges, offer cards, and promotional displays
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * BOGO Badge - Shows on products with buy-one-get-one offers
 */
export const BOGOBadge = ({ offer, size = 'medium' }) => {
  const isSmall = size === 'small';

  return (
    <View style={[styles.bogoBadge, isSmall && styles.bogoBadgeSmall]}>
      <Icon
        name="tag-heart"
        size={isSmall ? 12 : 16}
        color="#FFF"
      />
      <Text style={[styles.bogoText, isSmall && styles.bogoTextSmall]}>
        {offer?.discountPercent === 100 ? 'BOGO FREE' : `BOGO ${offer?.discountPercent}% OFF`}
      </Text>
    </View>
  );
};

/**
 * Special Offer Card - Displays promotional offers
 */
export const SpecialOfferCard = ({ offer, onPress }) => {
  const getOfferIcon = () => {
    switch (offer.type) {
      case 'bogo':
        return 'tag-multiple';
      case 'discount':
        return 'percent';
      case 'bundle':
        return 'package-variant';
      default:
        return 'star';
    }
  };

  const getOfferColor = () => {
    switch (offer.type) {
      case 'bogo':
        return '#FF6B6B';
      case 'discount':
        return '#4CAF50';
      case 'bundle':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={[styles.offerCard, { borderLeftColor: getOfferColor() }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.offerIconContainer, { backgroundColor: getOfferColor() }]}>
        <Icon name={getOfferIcon()} size={24} color="#FFF" />
      </View>

      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerDescription}>{offer.description}</Text>

        <View style={styles.offerMeta}>
          {offer.validUntil && (
            <View style={styles.validUntil}>
              <Icon name="clock-outline" size={12} color="#999" />
              <Text style={styles.validUntilText}>
                Until {formatDate(offer.validUntil)}
              </Text>
            </View>
          )}
          {offer.productCategory && offer.productCategory !== 'All' && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{offer.productCategory}</Text>
            </View>
          )}
        </View>
      </View>

      <Icon name="chevron-right" size={24} color="#CCC" />
    </TouchableOpacity>
  );
};

/**
 * Special Offers Section - Horizontal scrolling list of offers
 */
export const SpecialOffersSection = ({ offers, onOfferPress }) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="fire" size={22} color="#FF6B6B" />
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{offers.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersScroll}
      >
        {offers.map((offer) => (
          <SpecialOfferCardCompact
            key={offer.id}
            offer={offer}
            onPress={() => onOfferPress(offer)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Compact Offer Card - For horizontal scrolling
 */
const SpecialOfferCardCompact = ({ offer, onPress }) => {
  const getOfferColor = () => {
    switch (offer.type) {
      case 'bogo':
        return '#FF6B6B';
      case 'discount':
        return '#4CAF50';
      case 'bundle':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.compactCard, { borderColor: getOfferColor() }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.compactBadge, { backgroundColor: getOfferColor() }]}>
        <Text style={styles.compactBadgeText}>
          {offer.type === 'bogo' ? 'BOGO' : offer.discountPercent + '% OFF'}
        </Text>
      </View>

      <Text style={styles.compactTitle} numberOfLines={2}>
        {offer.title}
      </Text>

      <Text style={styles.compactDescription} numberOfLines={2}>
        {offer.description}
      </Text>

      <View style={styles.compactFooter}>
        <Text style={styles.compactCta}>Shop Now</Text>
        <Icon name="arrow-right" size={14} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );
};

/**
 * Weekend Deal Banner - Large promotional banner
 */
export const WeekendDealBanner = ({ deal, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.dealBanner}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.dealBannerContent}>
        <View style={styles.dealBannerIcon}>
          <Icon name="party-popper" size={32} color="#FFF" />
        </View>
        <View style={styles.dealBannerText}>
          <Text style={styles.dealBannerTitle}>{deal?.title || 'Weekend Special!'}</Text>
          <Text style={styles.dealBannerSubtitle}>
            {deal?.description || 'Buy 2 Get 1 Free on all soaps!'}
          </Text>
        </View>
      </View>
      <View style={styles.dealBannerCta}>
        <Text style={styles.dealBannerCtaText}>Shop Now</Text>
        <Icon name="arrow-right" size={18} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // BOGO Badge styles
  bogoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    zIndex: 10,
  },
  bogoBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bogoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  bogoTextSmall: {
    fontSize: 9,
  },

  // Offer Card styles
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validUntil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validUntilText: {
    fontSize: 11,
    color: '#999',
  },
  categoryTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },

  // Section styles
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  offersScroll: {
    paddingHorizontal: 12,
    gap: 12,
  },

  // Compact Card styles
  compactCard: {
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  compactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  compactBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  compactDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    flex: 1,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactCta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // Deal Banner styles
  dealBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dealBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dealBannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dealBannerText: {
    flex: 1,
  },
  dealBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  dealBannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  dealBannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  dealBannerCtaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default {
  BOGOBadge,
  SpecialOfferCard,
  SpecialOffersSection,
  WeekendDealBanner,
};

/**
 * Bundle Card Component
 * Displays product bundles with savings information
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CartContext } from '../context/CartContext';

/**
 * Bundle Card - Displays a single bundle product
 */
export const BundleCard = ({ bundle, onPress, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    // Create a bundle cart item
    const bundleItem = {
      id: bundle.id,
      _id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
      originalPrice: bundle.originalPrice,
      isBundle: true,
      bundleItems: bundle.items,
      image: bundle.image,
    };

    const result = await addToCart(bundleItem, 1);

    if (result.success) {
      Alert.alert(
        'Added to Cart!',
        `${bundle.name} has been added to your cart. You save $${bundle.savings.toFixed(2)}!`,
        [{ text: 'OK' }]
      );
      if (onAddToCart) onAddToCart(bundle);
    } else {
      Alert.alert('Error', result.error || 'Failed to add bundle to cart');
    }
  };

  return (
    <TouchableOpacity
      style={styles.bundleCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Savings Badge */}
      <View style={styles.savingsBadge}>
        <Icon name="tag" size={14} color="#FFF" />
        <Text style={styles.savingsText}>Save {bundle.savingsPercent}%</Text>
      </View>

      {/* Bundle Header */}
      <View style={styles.bundleHeader}>
        <View style={styles.bundleIconContainer}>
          <Icon name="package-variant" size={32} color="#4CAF50" />
        </View>
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleName}>{bundle.name}</Text>
          <Text style={styles.bundleDescription} numberOfLines={2}>
            {bundle.description}
          </Text>
        </View>
      </View>

      {/* Bundle Items List */}
      <View style={styles.itemsList}>
        <Text style={styles.includesLabel}>Includes:</Text>
        {bundle.items.map((item, index) => (
          <View key={index} style={styles.bundleItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.itemText}>
              {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
            </Text>
            <Text style={styles.itemPrice}>
              ${(item.originalPrice || item.price || 0).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>Regular Price</Text>
          <Text style={styles.originalPrice}>
            ${bundle.originalPrice.toFixed(2)}
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Icon name="arrow-right" size={20} color="#4CAF50" />
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>Bundle Price</Text>
          <Text style={styles.bundlePrice}>
            ${bundle.bundlePrice.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Savings Highlight */}
      <View style={styles.savingsHighlight}>
        <Icon name="piggy-bank" size={18} color="#4CAF50" />
        <Text style={styles.savingsHighlightText}>
          You save ${bundle.savings.toFixed(2)}!
        </Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
        activeOpacity={0.8}
      >
        <Icon name="cart-plus" size={20} color="#FFF" />
        <Text style={styles.addToCartText}>Add Bundle to Cart</Text>
      </TouchableOpacity>

      {/* Customizable indicator */}
      {bundle.isCustomizable && (
        <View style={styles.customizableTag}>
          <Icon name="tune" size={14} color="#2196F3" />
          <Text style={styles.customizableText}>Customizable</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Bundle Section - Horizontal scrolling list of bundles
 */
export const BundlesSection = ({ bundles, onBundlePress, onAddToCart }) => {
  if (!bundles || bundles.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="package-variant-closed" size={22} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Value Bundles</Text>
        <Text style={styles.sectionSubtitle}>Save more!</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bundlesScroll}
      >
        {bundles.map((bundle) => (
          <BundleCardCompact
            key={bundle.id}
            bundle={bundle}
            onPress={() => onBundlePress(bundle)}
            onAddToCart={onAddToCart}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Compact Bundle Card - For horizontal scrolling
 */
const BundleCardCompact = ({ bundle, onPress, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    const bundleItem = {
      id: bundle.id,
      _id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
      originalPrice: bundle.originalPrice,
      isBundle: true,
      bundleItems: bundle.items,
      image: bundle.image,
    };

    const result = await addToCart(bundleItem, 1);

    if (result.success) {
      if (onAddToCart) onAddToCart(bundle);
    }
  };

  return (
    <TouchableOpacity
      style={styles.compactBundleCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Savings Badge */}
      <View style={styles.compactSavingsBadge}>
        <Text style={styles.compactSavingsText}>
          -{bundle.savingsPercent}%
        </Text>
      </View>

      {/* Icon */}
      <View style={styles.compactIconContainer}>
        <Icon name="package-variant" size={36} color="#4CAF50" />
        {bundle.isCustomizable && (
          <View style={styles.compactCustomizeBadge}>
            <Icon name="tune" size={10} color="#FFF" />
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={styles.compactBundleName} numberOfLines={2}>
        {bundle.name}
      </Text>

      {/* Items count */}
      <Text style={styles.compactItemsCount}>
        {bundle.items.reduce((sum, item) => sum + item.quantity, 0)} items
      </Text>

      {/* Pricing */}
      <View style={styles.compactPricing}>
        <Text style={styles.compactOriginalPrice}>
          ${bundle.originalPrice.toFixed(2)}
        </Text>
        <Text style={styles.compactBundlePrice}>
          ${bundle.bundlePrice.toFixed(2)}
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.compactAddButton}
        onPress={handleAddToCart}
      >
        <Icon name="plus" size={18} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

/**
 * Featured Bundle Banner - Large promotional bundle
 */
export const FeaturedBundleBanner = ({ bundle, onPress }) => {
  if (!bundle) return null;

  return (
    <TouchableOpacity
      style={styles.featuredBanner}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.featuredContent}>
        <View style={styles.featuredBadge}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.featuredBadgeText}>BEST VALUE</Text>
        </View>

        <Text style={styles.featuredTitle}>{bundle.name}</Text>
        <Text style={styles.featuredDescription}>{bundle.description}</Text>

        <View style={styles.featuredPricing}>
          <Text style={styles.featuredOriginal}>
            ${bundle.originalPrice.toFixed(2)}
          </Text>
          <Text style={styles.featuredPrice}>
            ${bundle.bundlePrice.toFixed(2)}
          </Text>
          <View style={styles.featuredSavings}>
            <Text style={styles.featuredSavingsText}>
              Save ${bundle.savings.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.featuredIcon}>
        <Icon name="package-variant-closed-plus" size={48} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Full Bundle Card
  bundleCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  bundleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  bundleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  bundleDescription: {
    fontSize: 13,
    color: '#666',
  },
  itemsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  includesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bundleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 13,
    color: '#999',
  },
  pricingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  priceColumn: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bundlePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  savingsHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    gap: 6,
  },
  savingsHighlightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  customizableTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  customizableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2196F3',
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
  sectionSubtitle: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  bundlesScroll: {
    paddingHorizontal: 12,
    gap: 12,
  },

  // Compact Bundle Card
  compactBundleCard: {
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  compactSavingsBadge: {
    position: 'absolute',
    top: -6,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  compactSavingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  compactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  compactCustomizeBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactBundleName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  compactItemsCount: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  compactPricing: {
    alignItems: 'center',
    marginBottom: 8,
  },
  compactOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  compactBundlePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  compactAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Featured Banner
  featuredBanner: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  featuredContent: {
    flex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  featuredPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredOriginal: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
  },
  featuredPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  featuredSavings: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredSavingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  featuredIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    opacity: 0.8,
  },
});

export default BundleCard;

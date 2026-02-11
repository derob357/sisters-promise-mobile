/**
 * Home Screen - Product Browse with Rewards Dashboard
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProductCard, Spinner, ErrorMessage } from '../components/CommonComponents';
import RewardsDashboard from '../components/RewardsDashboard';
import { SpecialOffersSection, WeekendDealBanner, BOGOBadge } from '../components/SpecialOffers';
import { BundlesSection, FeaturedBundleBanner } from '../components/BundleCard';
import { useRewards } from '../context/RewardsContext';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { specialOffers, bundles, loadSpecialOffers, loadBundles } = useRewards();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
      loadSpecialOffers();
      loadBundles();
      analyticsService.trackScreenView('home');
    });
    return unsubscribe;
  }, [navigation, loadSpecialOffers, loadBundles]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const productsData = await productService.getProducts();

      // Ensure productsData is an array
      const validProducts = Array.isArray(productsData) ? productsData : [];

      if (validProducts.length === 0) {
        setProducts([]);
        setCategories(['All']);
      } else {
        setProducts(validProducts);
        // Initialize categories - safely extract and validate
        const uniqueCategories = new Set(
          validProducts
            .filter((p) => p && p.category) // Filter out null/undefined products
            .map((p) => p.category)
        );
        setCategories(['All', ...Array.from(uniqueCategories)]);
      }
    } catch (err) {
      logger.error('Load products error:', err);
      setError('Failed to load products');
      logger.error('Load products error:', err);
      setProducts([]);
      setCategories(['All']);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProducts(), loadSpecialOffers(), loadBundles()]);
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const results = await productService.search(searchQuery);

      // Ensure results is an array
      const validResults = Array.isArray(results) ? results : [];

      setProducts(validResults);

      // Track search with validation
      if (analyticsService && analyticsService.trackSearch) {
        await analyticsService
          .trackSearch(searchQuery, validResults.length)
          .catch((err) => logger.error('Error tracking search:', err));
      }
    } catch (err) {
      logger.error('Search error:', err);
      setError('Search failed');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      let data;

      if (category === 'All') {
        data = await productService.getProducts();
      } else {
        data = await productService.getByCategory(category);
      }

      // Ensure data is an array
      const validData = Array.isArray(data) ? data : [];
      setProducts(validData);

      if (validData.length === 0) {
        setError('');
      }
    } catch (err) {
      logger.error('Category filter error:', err);
      setError('Filter failed');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    const productId = product._id || product.id || product.etsyListingId;
    analyticsService.trackProductView(
      productId,
      product.name,
      product.price,
      product.category
    );
    navigation.navigate('ProductDetail', { product });
  };

  const handleRewardsPress = () => {
    // Navigate to rewards details screen (future implementation)
    Alert.alert(
      'Your Rewards',
      'Full rewards history and redemption coming soon! Keep shopping to earn more points and free gifts.',
      [{ text: 'OK' }]
    );
  };

  const handleOfferPress = (offer) => {
    // Filter products by offer category or navigate to offer details
    if (offer.productCategory && offer.productCategory !== 'All') {
      handleCategoryFilter(offer.productCategory);
    }
    analyticsService.trackEvent('offer_clicked', { offerId: offer.id, offerType: offer.type });
  };

  const handleBundlePress = (bundle) => {
    // Show bundle details
    Alert.alert(
      bundle.name,
      `${bundle.description}\n\nRegular Price: $${bundle.originalPrice.toFixed(2)}\nBundle Price: $${bundle.bundlePrice.toFixed(2)}\nYou Save: $${bundle.savings.toFixed(2)} (${bundle.savingsPercent}%)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Details',
          onPress: () => {
            // Future: Navigate to bundle details screen
          },
        },
      ]
    );
    analyticsService.trackEvent('bundle_viewed', { bundleId: bundle.id });
  };

  const handleBundleAddToCart = (bundle) => {
    analyticsService.trackEvent('bundle_added_to_cart', {
      bundleId: bundle.id,
      bundlePrice: bundle.bundlePrice,
      savings: bundle.savings,
    });
  };

  // Check if product has BOGO offer
  const getProductOffer = (product) => {
    if (!specialOffers || specialOffers.length === 0) return null;

    return specialOffers.find(
      (offer) =>
        offer.type === 'bogo' &&
        (offer.productCategory === 'All' ||
          offer.productCategory === product.category)
    );
  };

  // Get featured bundle (first one with highest savings)
  const featuredBundle =
    bundles && bundles.length > 0
      ? bundles.reduce((prev, current) =>
          (prev.savingsPercent || 0) > (current.savingsPercent || 0) ? prev : current
        )
      : null;

  if (loading && products.length === 0) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          {user && (
            <Text style={styles.welcomeText}>Welcome, {user.name || 'Friend'}!</Text>
          )}
        </View>

        {error && <ErrorMessage message={error} />}

        {/* Rewards Dashboard - Only show for logged in users */}
        {user && (
          <RewardsDashboard onPress={handleRewardsPress} />
        )}

        {/* Weekend Deal / Featured Offer Banner */}
        {specialOffers && specialOffers.length > 0 && (
          <WeekendDealBanner
            deal={specialOffers[0]}
            onPress={() => handleOfferPress(specialOffers[0])}
          />
        )}

        {/* Special Offers Section */}
        <SpecialOffersSection
          offers={specialOffers}
          onOfferPress={handleOfferPress}
        />

        {/* Bundles Section */}
        <BundlesSection
          bundles={bundles}
          onBundlePress={handleBundlePress}
          onAddToCart={handleBundleAddToCart}
        />

        {/* Featured Bundle Banner */}
        {featuredBundle && featuredBundle.savingsPercent >= 25 && (
          <FeaturedBundleBanner
            bundle={featuredBundle}
            onPress={() => handleBundlePress(featuredBundle)}
          />
        )}

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} accessibilityLabel="Search products" accessibilityRole="button">
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesSection}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryFilter(category)}
              accessibilityLabel={`Filter by ${category}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === category }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Section */}
        <View style={styles.productsSectionHeader}>
          <Icon name="shopping" size={20} color="#4CAF50" />
          <Text style={styles.productsSectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          <Text style={styles.productsCount}>
            {products.length} items
          </Text>
        </View>

        <View style={styles.productsSection}>
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="shopping-search" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No products found</Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  handleCategoryFilter('All');
                }}
                accessibilityLabel="Reset product filters"
                accessibilityRole="button"
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            products.map((product, index) => {
              const offer = getProductOffer(product);
              return (
                <View
                  key={product._id || product.id || product.etsyListingId || `product-${index}`}
                  style={styles.productCardWrapper}
                >
                  {offer && <BOGOBadge offer={offer} size="small" />}
                  <ProductCard
                    product={product}
                    onPress={() => handleProductPress(product)}
                  />
                </View>
              );
            })
          )}
        </View>

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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  searchIcon: {
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  categoriesSection: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  productsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  productsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  productsCount: {
    fontSize: 13,
    color: '#999',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productCardWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 12,
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default HomeScreen;

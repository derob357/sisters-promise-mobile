/**
 * Home Screen - Product Browse
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { ProductCard, Spinner, ErrorMessage } from '../components/CommonComponents';
import productService from '../services/productService';
import analyticsService from '../services/analyticsService';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
      analyticsService.trackScreenView('home');
    });
    return unsubscribe;
  }, [navigation]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const productsData = await productService.getProducts();
      setProducts(productsData);
      // Initialize categories
      setCategories(['All', ...new Set(productsData.map((p) => p.category))]);
    } catch (err) {
      setError('Failed to load products');
      console.log('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const results = await productService.search(searchQuery);
      setProducts(results);
      await analyticsService.trackSearch(searchQuery, results.length);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      if (category === 'All') {
        const data = await productService.getProducts();
        setProducts(data);
      } else {
        const data = await productService.getByCategory(category);
        setProducts(data);
      }
    } catch (err) {
      setError('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    analyticsService.trackProductView(product.id, product.name, product.price, product.category);
    navigation.navigate('ProductDetail', { product });
  };

  if (loading && products.length === 0) {
    return <Spinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesSection}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryFilter(category)}
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

      <View style={styles.productsSection}>
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No products found</Text>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchButtonText: {
    fontSize: 18,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
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
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 32,
  },
});

export default HomeScreen;

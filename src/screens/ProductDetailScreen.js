/**
 * Product Detail Screen
 */

import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { Button, Header, SuccessMessage } from '../components/CommonComponents';
import { getSafeImageSource, getProductImageUrl } from '../utils/imageUtil';
import analyticsService from '../services/analyticsService';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity);
    if (result.success) {
      await analyticsService.trackAddToCart(product.id, product.name, product.price, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      setQuantity(1);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title={product.name} onBackPress={() => navigation.goBack()} />

      {addedToCart && <SuccessMessage message="Added to cart!" />}

      {getSafeImageSource(getProductImageUrl(product)) && (
        <Image
          source={getSafeImageSource(getProductImageUrl(product))}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.priceSection}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
          )}
        </View>

        {product.rating && (
          <Text style={styles.rating}>★ {product.rating}/5 ({product.reviews} reviews)</Text>
        )}

        <View style={styles.divider} />

        {product.description && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </>
        )}

        {product.ingredients && (
          <>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredients}>{product.ingredients}</Text>
          </>
        )}

        {product.usage && (
          <>
            <Text style={styles.sectionTitle}>How to Use</Text>
            <Text style={styles.usage}>{product.usage}</Text>
          </>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantitySection}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={String(quantity)}
            onChangeText={(value) => setQuantity(Math.max(1, parseInt(value) || 1))}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
          style={styles.buyNowButton}
          textStyle={styles.buyNowText}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  rating: {
    fontSize: 14,
    color: '#FFB800',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  usage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  quantityInput: {
    flex: 1,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 8,
  },
  addToCartText: {
    color: '#4CAF50',
  },
  buyNowButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 16,
  },
  buyNowText: {
    color: '#FFF',
  },
});

export default ProductDetailScreen;

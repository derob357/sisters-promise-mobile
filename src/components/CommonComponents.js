/**
 * Common Components - Header, Buttons, Cards, etc.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getSafeImageSource, getProductImageUrl } from '../utils/imageUtil';

// Header Component
export const Header = ({ title, onBackPress, rightComponent }) => (
  <View style={styles.header}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.rightComponent}>{rightComponent}</View>
  </View>
);

// Button Component
export const Button = ({ onPress, title, style, textStyle, disabled, loading }) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    )}
  </TouchableOpacity>
);

// Input Component
export const TextInput = ({ placeholder, value, onChangeText, style, ...props }) => (
  <View style={[styles.inputContainer, style]}>
    <Text style={styles.inputLabel}>{placeholder}</Text>
    <View style={styles.input}>
      <Text style={styles.textInput} {...props} onChangeText={onChangeText}>
        {value}
      </Text>
    </View>
  </View>
);

// Product Card
export const ProductCard = ({ product, onPress }) => {
  const imageUrl = getProductImageUrl(product);
  const imageSource = imageUrl ? getSafeImageSource(imageUrl) : null;

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {imageSource && (
        <Image source={imageSource} style={styles.productImage} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Cart Item Component
export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const imageSource = item.image ? getSafeImageSource(item.image) : null;

  return (
    <View style={styles.cartItem}>
      {imageSource && <Image source={imageSource} style={styles.cartItemImage} />}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}>
            <Text style={styles.quantityButton}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

// Loading Spinner
export const Spinner = () => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
  </View>
);

// Error Message
export const ErrorMessage = ({ message }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

// Success Message
export const SuccessMessage = ({ message }) => (
  <View style={styles.successContainer}>
    <Text style={styles.successText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  rightComponent: {
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  textInput: {
    fontSize: 14,
    color: '#333',
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 18,
    color: '#4CAF50',
    paddingHorizontal: 8,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    color: '#333',
  },
  removeButton: {
    padding: 8,
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
  },
});

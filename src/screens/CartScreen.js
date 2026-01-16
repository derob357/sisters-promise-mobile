/**
 * Cart Screen
 */

import React, { useContext, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext';
import { CartItem, Header, Button, Spinner } from '../components/CommonComponents';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

const CartScreen = ({ navigation }) => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // Track purchase
      await analyticsService.trackPurchase({
        value: cartTotal,
        currency: 'USD',
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      // Navigate to checkout
      navigation.navigate('Checkout', { cart, total: cartTotal });
    } catch (error) {
      logger.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && cart.length > 0) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <Header title="Shopping Cart" onBackPress={() => navigation.goBack()} />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some products to get started!</Text>
          <Button
            title="Continue Shopping"
            onPress={() => navigation.navigate('Home')}
            style={styles.continueButton}
          />
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartItemsContainer}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalPrice}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalPrice}>Free</Text>
            </View>
            <View style={[styles.totalSection, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalPrice}>${cartTotal.toFixed(2)}</Text>
            </View>

            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              disabled={loading}
              loading={loading}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cartItemsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
    textAlign: 'center',
  },
  continueButton: {
    paddingHorizontal: 32,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTopVertical: 12,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default CartScreen;

/**
 * Checkout Screen
 */

import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { Header, Button, ErrorMessage, CartItem, Spinner } from '../components/CommonComponents';
import analyticsService from '../services/analyticsService';
import api from '../services/api';
import logger from '../utils/logger';

const CheckoutScreen = ({ route, navigation }) => {
  const { cart, total } = route.params || {};
  const { clearCart } = useContext(CartContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!fullName || !email || !phone || !address || !city || !state || !zip) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order
      const response = await api.post('/orders', {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingInfo: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          zip,
        },
        totalAmount: total,
      });

      if (response.data.success) {
        // Track order
        await analyticsService.trackEvent('order_completed', {
          orderId: response.data.orderId,
          amount: total,
          itemCount: cart.length,
        });

        // Clear cart
        await clearCart();

        Alert.alert(
          'Order Placed',
          'Your order has been placed successfully. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
      logger.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Checkout" onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Checkout" onBackPress={() => navigation.goBack()} />

      {error && <ErrorMessage message={error} />}

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cart.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text style={styles.totalPrice}>Free</Text>
        </View>
        <View style={[styles.totalSection, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalPrice}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Shipping Information</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="(555) 123-4567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Main Street"
          value={address}
          onChangeText={setAddress}
          editable={!loading}
        />

        <View style={styles.twoColumnRow}>
          <View style={styles.column}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              editable={!loading}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="CA"
              value={state}
              onChangeText={setState}
              editable={!loading}
            />
          </View>
        </View>

        <Text style={styles.label}>ZIP Code</Text>
        <TextInput
          style={styles.input}
          placeholder="12345"
          value={zip}
          onChangeText={setZip}
          keyboardType="number-pad"
          editable={!loading}
        />

        <Button title="Complete Order" onPress={handleCheckout} disabled={loading} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.privacyText}>
            By placing this order, you agree to our Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  orderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemQty: {
    fontSize: 12,
    color: '#999',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
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
    paddingTop: 12,
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  privacyText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;

/**
 * Order Management Screen - Admin order management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Spinner, ErrorMessage, Button } from '../components/CommonComponents';
import api from '../services/api';
import logger from '../utils/logger';

const OrderManagementScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setError('');
      const endpoint = filter === 'all'
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${filter}`;
      const response = await api.get(endpoint);
      if (response.data && response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders(getPlaceholderOrders());
      }
    } catch (err) {
      logger.error('Error loading orders:', err);
      setOrders(getPlaceholderOrders());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getPlaceholderOrders = () => [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      total: 89.99,
      status: 'pending',
      items: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      total: 145.50,
      status: 'processing',
      items: 5,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Order status updated');
        loadOrders();
      }
    } catch (err) {
      logger.error('Error updating order:', err);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleStatusChange = (order) => {
    Alert.alert(
      'Update Status',
      `Change status for Order #${order.id}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pending', onPress: () => updateOrderStatus(order.id, 'pending') },
        { text: 'Processing', onPress: () => updateOrderStatus(order.id, 'processing') },
        { text: 'Shipped', onPress: () => updateOrderStatus(order.id, 'shipped') },
        { text: 'Delivered', onPress: () => updateOrderStatus(order.id, 'delivered') },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Order Management"
        onBackPress={() => navigation.goBack()}
      />

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              filter === option.key && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(option.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === option.key && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && <ErrorMessage message={error} />}

        <View style={styles.content}>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          ) : (
            orders.map((order, index) => (
              <View key={order._id || order.id || `order-${index}`} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order._id || order.id}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="person-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{order.customerName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="mail-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{order.customerEmail}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="cube-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{order.items} items</Text>
                  </View>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>
                    ${order.total?.toFixed(2)}
                  </Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => navigation.navigate('OrderDetail', { order })}
                    >
                      <Icon name="eye-outline" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleStatusChange(order)}
                    >
                      <Icon name="create-outline" size={20} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '#FF9800';
    case 'processing':
      return '#2196F3';
    case 'shipped':
      return '#9C27B0';
    case 'delivered':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#999';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default OrderManagementScreen;

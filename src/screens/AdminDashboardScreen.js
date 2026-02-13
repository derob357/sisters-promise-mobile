/**
 * Admin Dashboard Screen - Admin/Owner management panel
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { Header, Spinner, ErrorMessage } from '../components/CommonComponents';
import api from '../services/api';
import logger from '../utils/logger';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setError('');
      const response = await api.get('/api/admin/stats');
      if (response.data && response.data.success) {
        setStats(response.data.stats);
      } else {
        // Use placeholder stats if API not available
        setStats(getPlaceholderStats());
      }
    } catch (err) {
      logger.error('Error loading admin stats:', err);
      // Use placeholder stats on error
      setStats(getPlaceholderStats());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getPlaceholderStats = () => ({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
  });

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardStats();
  };

  const isOwner = user?.role === 'owner';

  if (loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin Dashboard" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && <ErrorMessage message={error} />}

        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome, {user?.firstName || user?.name || 'Admin'}
            </Text>
            <Text style={styles.roleText}>
              Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="receipt-outline" size={28} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats?.totalOrders || 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="time-outline" size={28} color="#FF9800" />
              <Text style={styles.statNumber}>{stats?.pendingOrders || 0}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="cash-outline" size={28} color="#2196F3" />
              <Text style={styles.statNumber}>
                ${(stats?.totalRevenue || 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="people-outline" size={28} color="#9C27B0" />
              <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('OrderManagement')}
          >
            <Icon name="list-outline" size={24} color="#4CAF50" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Orders</Text>
              <Text style={styles.actionDescription}>
                View and manage customer orders
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ProductManagement')}
          >
            <Icon name="cube-outline" size={24} color="#2196F3" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Products</Text>
              <Text style={styles.actionDescription}>
                Add, edit, or remove products
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Icon name="people-outline" size={24} color="#9C27B0" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Users</Text>
              <Text style={styles.actionDescription}>
                View and manage user accounts
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminRewards')}
          >
            <Icon name="gift-outline" size={24} color="#FF9800" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Rewards</Text>
              <Text style={styles.actionDescription}>
                Offers, bundles, and loyalty stats
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#CCC" />
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('SystemSettings')}
            >
              <Icon name="settings-outline" size={24} color="#FF5722" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>System Settings</Text>
                <Text style={styles.actionDescription}>
                  Configure system preferences
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#CCC" />
            </TouchableOpacity>
          )}

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Orders</Text>

          {stats?.recentOrders?.length > 0 ? (
            stats.recentOrders.slice(0, 5).map((order, index) => (
              <View key={order._id || order.id || `order-${index}`} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>Order #{order._id || order.id}</Text>
                  <Text style={styles.orderCustomer}>{order.customerName}</Text>
                </View>
                <View style={styles.orderMeta}>
                  <Text style={styles.orderAmount}>
                    ${order.total?.toFixed(2)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent orders</Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  roleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default AdminDashboardScreen;

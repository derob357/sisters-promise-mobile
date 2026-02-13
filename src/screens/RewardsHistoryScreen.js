/**
 * Rewards History Screen
 * Displays the user's detailed rewards transaction history with filtering.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Spinner } from '../components/CommonComponents';
import rewardsService from '../services/rewardsService';
import logger from '../utils/logger';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Earned', value: 'earned' },
  { label: 'Redeemed', value: 'redeemed' },
  { label: 'Gifts', value: 'gifts' },
];

const getIconForType = (type) => {
  switch (type) {
    case 'earned':
      return { name: 'arrow-up-circle', color: '#4CAF50' };
    case 'redeemed':
      return { name: 'arrow-down-circle', color: '#FF9800' };
    case 'gift_redeemed':
      return { name: 'gift', color: '#F44336' };
    default:
      return { name: 'circle', color: '#999' };
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const RewardsHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchHistory = async () => {
    try {
      const data = await rewardsService.getRewardsHistory();
      setHistory(data);
    } catch (error) {
      logger.error('Failed to load rewards history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'earned') return item.type === 'earned';
    if (activeFilter === 'redeemed') return item.type === 'redeemed';
    if (activeFilter === 'gifts') return item.type === 'gift_redeemed';
    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Rewards History" onBackPress={() => navigation.goBack()} />
        <Spinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Rewards History" onBackPress={() => navigation.goBack()} />

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterPill,
              activeFilter === filter.value && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === filter.value && styles.filterPillTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
        }
      >
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>No rewards history yet</Text>
          </View>
        ) : (
          filteredHistory.map((item, index) => {
            const icon = getIconForType(item.type);
            const isEarned = item.type === 'earned';

            return (
              <View key={item._id || index} style={styles.historyItem}>
                <View style={styles.iconContainer}>
                  <Icon name={icon.name} size={28} color={icon.color} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={[styles.itemPoints, isEarned ? styles.pointsEarned : styles.pointsRedeemed]}>
                  {isEarned ? '+' : '-'}{item.points}
                </Text>
              </View>
            );
          })
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#4CAF50',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  pointsEarned: {
    color: '#4CAF50',
  },
  pointsRedeemed: {
    color: '#F44336',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  spacer: {
    height: 32,
  },
});

export default RewardsHistoryScreen;

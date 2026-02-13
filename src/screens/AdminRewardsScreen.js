/**
 * Admin Rewards Screen - Manage and track the rewards program
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Spinner, ErrorMessage } from '../components/CommonComponents';
import api from '../services/api';
import logger from '../utils/logger';

const TIER_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#E5E4E2',
};

const TIER_ORDER = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

const AdminRewardsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Offer modal state
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    type: 'bogo',
    productCategory: 'All',
    discountPercent: '',
    minQuantity: '',
  });

  // Bundle modal state
  const [bundleModalVisible, setBundleModalVisible] = useState(false);
  const [bundleForm, setBundleForm] = useState({
    name: '',
    description: '',
    originalPrice: '',
    bundlePrice: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setError('');
      await Promise.all([loadStats(), loadOffers(), loadBundles()]);
    } catch (err) {
      logger.error('Error loading rewards data:', err);
      setError('Failed to load rewards data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/api/admin/rewards/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      logger.error('Error loading rewards stats:', err);
      setStats({
        totalMembers: 0,
        totalPointsIssued: 0,
        giftsRedeemed: 0,
        tierDistribution: {},
      });
    }
  };

  const loadOffers = async () => {
    try {
      const response = await api.get('/api/rewards/offers');
      if (response.data) {
        setOffers(Array.isArray(response.data) ? response.data : response.data.offers || []);
      }
    } catch (err) {
      logger.error('Error loading offers:', err);
      setOffers([]);
    }
  };

  const loadBundles = async () => {
    try {
      const response = await api.get('/api/rewards/bundles');
      if (response.data) {
        setBundles(Array.isArray(response.data) ? response.data : response.data.bundles || []);
      }
    } catch (err) {
      logger.error('Error loading bundles:', err);
      setBundles([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleDeleteOffer = (offerId) => {
    Alert.alert('Delete Offer', 'Are you sure you want to delete this offer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/rewards/offers/${offerId}`);
            setOffers((prev) => prev.filter((o) => (o._id || o.id) !== offerId));
          } catch (err) {
            logger.error('Error deleting offer:', err);
            Alert.alert('Error', 'Failed to delete offer');
          }
        },
      },
    ]);
  };

  const handleCreateOffer = async () => {
    if (!offerForm.title.trim()) {
      Alert.alert('Validation', 'Please enter an offer title');
      return;
    }
    try {
      const payload = {
        ...offerForm,
        discountPercent: offerForm.discountPercent ? Number(offerForm.discountPercent) : 0,
        minQuantity: offerForm.minQuantity ? Number(offerForm.minQuantity) : 1,
      };
      await api.post('/api/admin/rewards/offers', payload);
      setOfferModalVisible(false);
      setOfferForm({
        title: '',
        description: '',
        type: 'bogo',
        productCategory: 'All',
        discountPercent: '',
        minQuantity: '',
      });
      await loadOffers();
    } catch (err) {
      logger.error('Error creating offer:', err);
      Alert.alert('Error', 'Failed to create offer');
    }
  };

  const handleDeleteBundle = (bundleId) => {
    Alert.alert('Delete Bundle', 'Are you sure you want to delete this bundle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/rewards/bundles/${bundleId}`);
            setBundles((prev) => prev.filter((b) => (b._id || b.id) !== bundleId));
          } catch (err) {
            logger.error('Error deleting bundle:', err);
            Alert.alert('Error', 'Failed to delete bundle');
          }
        },
      },
    ]);
  };

  const handleCreateBundle = async () => {
    if (!bundleForm.name.trim()) {
      Alert.alert('Validation', 'Please enter a bundle name');
      return;
    }
    try {
      const payload = {
        ...bundleForm,
        originalPrice: bundleForm.originalPrice ? Number(bundleForm.originalPrice) : 0,
        bundlePrice: bundleForm.bundlePrice ? Number(bundleForm.bundlePrice) : 0,
      };
      await api.post('/api/admin/rewards/bundles', payload);
      setBundleModalVisible(false);
      setBundleForm({
        name: '',
        description: '',
        originalPrice: '',
        bundlePrice: '',
      });
      await loadBundles();
    } catch (err) {
      logger.error('Error creating bundle:', err);
      Alert.alert('Error', 'Failed to create bundle');
    }
  };

  const getHighestTierCount = () => {
    const dist = stats?.tierDistribution || {};
    let highest = { tier: 'N/A', count: 0 };
    for (const tier of TIER_ORDER) {
      const count = dist[tier] || 0;
      if (count >= highest.count) {
        highest = { tier, count };
      }
    }
    return highest;
  };

  const getTotalTierMembers = () => {
    const dist = stats?.tierDistribution || {};
    return Object.values(dist).reduce((sum, count) => sum + (count || 0), 0);
  };

  if (loading) {
    return <Spinner />;
  }

  const highestTier = getHighestTierCount();
  const totalTierMembers = getTotalTierMembers();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Rewards Management" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? <ErrorMessage message={error} /> : null}

        <View style={styles.content}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="people-outline" size={28} color="#9C27B0" />
              <Text style={styles.statNumber}>{stats?.totalMembers || 0}</Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="star-outline" size={28} color="#FF9800" />
              <Text style={styles.statNumber}>{stats?.totalPointsIssued || 0}</Text>
              <Text style={styles.statLabel}>Total Points Issued</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="gift-outline" size={28} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats?.giftsRedeemed || 0}</Text>
              <Text style={styles.statLabel}>Gifts Redeemed</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="trophy-outline" size={28} color="#2196F3" />
              <Text style={styles.statNumber}>{highestTier.count}</Text>
              <Text style={styles.statLabel}>{highestTier.tier} Tier</Text>
            </View>
          </View>

          {/* Tier Distribution */}
          <Text style={styles.sectionTitle}>Tier Distribution</Text>
          <View style={styles.tierContainer}>
            {TIER_ORDER.map((tier) => {
              const count = stats?.tierDistribution?.[tier] || 0;
              const percentage = totalTierMembers > 0 ? (count / totalTierMembers) * 100 : 0;
              return (
                <View key={tier} style={styles.tierRow}>
                  <View style={styles.tierLabelRow}>
                    <View style={[styles.tierDot, { backgroundColor: TIER_COLORS[tier] }]} />
                    <Text style={styles.tierName}>{tier}</Text>
                    <Text style={styles.tierCount}>{count}</Text>
                  </View>
                  <View style={styles.tierBarBackground}>
                    <View
                      style={[
                        styles.tierBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: TIER_COLORS[tier],
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Active Offers */}
          <Text style={styles.sectionTitle}>Active Offers</Text>
          {offers.length > 0 ? (
            offers.map((offer, index) => (
              <View key={offer._id || offer.id || `offer-${index}`} style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.actionTitle}>{offer.title}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{offer.type || 'offer'}</Text>
                    </View>
                  </View>
                  {offer.description ? (
                    <Text style={styles.actionDescription}>{offer.description}</Text>
                  ) : null}
                  {offer.validUntil ? (
                    <Text style={styles.validUntilText}>
                      Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteOffer(offer._id || offer.id)}
                >
                  <Icon name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active offers</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setOfferModalVisible(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Offer</Text>
          </TouchableOpacity>

          {/* Active Bundles */}
          <Text style={styles.sectionTitle}>Active Bundles</Text>
          {bundles.length > 0 ? (
            bundles.map((bundle, index) => {
              const savings = bundle.originalPrice && bundle.bundlePrice
                ? Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100)
                : 0;
              return (
                <View key={bundle._id || bundle.id || `bundle-${index}`} style={styles.actionCard}>
                  <View style={styles.actionContent}>
                    <View style={styles.offerHeader}>
                      <Text style={styles.actionTitle}>{bundle.name}</Text>
                      {savings > 0 ? (
                        <View style={[styles.typeBadge, { backgroundColor: '#4CAF50' }]}>
                          <Text style={styles.typeBadgeText}>Save {savings}%</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.actionDescription}>
                      ${Number(bundle.bundlePrice || 0).toFixed(2)}{' '}
                      <Text style={styles.originalPriceText}>
                        ${Number(bundle.originalPrice || 0).toFixed(2)}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBundle(bundle._id || bundle.id)}
                  >
                    <Icon name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active bundles</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setBundleModalVisible(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Bundle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Offer Modal */}
      <Modal
        visible={offerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOfferModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Offer</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Offer title"
              placeholderTextColor="#999"
              value={offerForm.title}
              onChangeText={(text) => setOfferForm({ ...offerForm, title: text })}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Offer description"
              placeholderTextColor="#999"
              value={offerForm.description}
              onChangeText={(text) => setOfferForm({ ...offerForm, description: text })}
              multiline
            />

            <Text style={styles.inputLabel}>Type</Text>
            <TextInput
              style={styles.input}
              placeholder="bogo"
              placeholderTextColor="#999"
              value={offerForm.type}
              onChangeText={(text) => setOfferForm({ ...offerForm, type: text })}
            />

            <Text style={styles.inputLabel}>Product Category</Text>
            <TextInput
              style={styles.input}
              placeholder="All"
              placeholderTextColor="#999"
              value={offerForm.productCategory}
              onChangeText={(text) => setOfferForm({ ...offerForm, productCategory: text })}
            />

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>Discount %</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  value={offerForm.discountPercent}
                  onChangeText={(text) => setOfferForm({ ...offerForm, discountPercent: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>Min Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor="#999"
                  value={offerForm.minQuantity}
                  onChangeText={(text) => setOfferForm({ ...offerForm, minQuantity: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setOfferModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateOffer}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Bundle Modal */}
      <Modal
        visible={bundleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBundleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bundle</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Bundle name"
              placeholderTextColor="#999"
              value={bundleForm.name}
              onChangeText={(text) => setBundleForm({ ...bundleForm, name: text })}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Bundle description"
              placeholderTextColor="#999"
              value={bundleForm.description}
              onChangeText={(text) => setBundleForm({ ...bundleForm, description: text })}
              multiline
            />

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>Original Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  value={bundleForm.originalPrice}
                  onChangeText={(text) => setBundleForm({ ...bundleForm, originalPrice: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.inputLabel}>Bundle Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  value={bundleForm.bundlePrice}
                  onChangeText={(text) => setBundleForm({ ...bundleForm, bundlePrice: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBundleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateBundle}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
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
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  actionDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  // Tier Distribution
  tierContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tierRow: {
    marginBottom: 12,
  },
  tierLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  tierCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  tierBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tierBarFill: {
    height: 8,
    borderRadius: 4,
    minWidth: 2,
  },
  // Offers & Bundles
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  validUntilText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  originalPriceText: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#333',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formHalf: {
    width: '48%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default AdminRewardsScreen;

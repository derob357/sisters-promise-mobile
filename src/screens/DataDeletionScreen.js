/**
 * Data Deletion Screen
 * Required by Google Play for apps with user accounts.
 */

import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Header, Button } from '../components/CommonComponents';
import api from '../services/api';
import logger from '../utils/logger';

const SUPPORT_EMAIL = 'support@sisterspromise.com';

const DataDeletionScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleEmailRequest = () => {
    const subject = encodeURIComponent('Account & Data Deletion Request');
    const body = encodeURIComponent(
      `Hi Sisters Promise,\n\nI would like to request deletion of my account and all associated data.\n\nAccount email: ${user?.email || '(your email)'}\n\nThank you.`
    );
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  const handleDeleteRequest = () => {
    Alert.alert(
      'Delete Account & Data',
      'This will permanently delete your account and all associated data including order history, profile information, and rewards. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Data',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.post('/api/auth/delete-account');
              Alert.alert(
                'Request Submitted',
                'Your data deletion request has been submitted. Your account will be deleted within 30 days. You will be logged out now.',
                [
                  {
                    text: 'OK',
                    onPress: () => logout(),
                  },
                ]
              );
            } catch (err) {
              logger.error('Data deletion request error:', err);
              Alert.alert(
                'Request via Email',
                `We couldn't process your request automatically. Please email us at ${SUPPORT_EMAIL} to request data deletion.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Send Email', onPress: handleEmailRequest },
                ]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Delete Your Data" onBackPress={() => navigation.goBack()} />

        <View style={styles.content}>
          <Text style={styles.heading}>Account & Data Deletion</Text>

          <Text style={styles.paragraph}>
            You have the right to request deletion of your account and personal data.
            When you request deletion, we will remove:
          </Text>

          <View style={styles.list}>
            <Text style={styles.listItem}>- Your account and login credentials</Text>
            <Text style={styles.listItem}>- Personal information (name, email, phone, address)</Text>
            <Text style={styles.listItem}>- Order history</Text>
            <Text style={styles.listItem}>- Rewards points and history</Text>
            <Text style={styles.listItem}>- Chat messages</Text>
          </View>

          <Text style={styles.paragraph}>
            Data deletion will be completed within 30 days of your request. Some data
            may be retained as required by law (e.g., financial transaction records).
          </Text>

          <Text style={styles.sectionTitle}>Option 1: Delete In-App</Text>
          <Text style={styles.paragraph}>
            Tap the button below to submit a data deletion request directly.
          </Text>

          <Button
            title="Request Data Deletion"
            onPress={handleDeleteRequest}
            disabled={loading}
            loading={loading}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            accessibilityLabel="Request deletion of your account and data"
          />

          <Text style={styles.sectionTitle}>Option 2: Email Us</Text>
          <Text style={styles.paragraph}>
            You can also email us directly at {SUPPORT_EMAIL} to request data deletion.
          </Text>

          <Button
            title="Send Email Request"
            onPress={handleEmailRequest}
            style={styles.emailButton}
            textStyle={styles.emailButtonText}
            accessibilityLabel="Send email to request data deletion"
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
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  list: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#FFF',
  },
  emailButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginTop: 8,
  },
  emailButtonText: {
    color: '#4CAF50',
  },
});

export default DataDeletionScreen;

/**
 * Profile Screen
 */

import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Header, Button, ErrorMessage, SuccessMessage } from '../components/CommonComponents';
import authService from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangePasswordMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.centerContent}>
          <Text style={styles.noUserText}>Please login to view your profile</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Profile" />

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.infoValue}>{user.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>

          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.infoValue}>{user.role || 'Subscriber'}</Text>

          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.infoValue}>
            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.divider} />

        {!changePasswordMode ? (
          <Button
            title="Change Password"
            onPress={() => setChangePasswordMode(true)}
            style={styles.buttonSecondary}
            textStyle={styles.buttonSecondaryText}
          />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />

            <Button
              title="Save Password"
              onPress={handleChangePassword}
              disabled={loading}
              loading={loading}
            />

            <Button
              title="Cancel"
              onPress={() => {
                setChangePasswordMode(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
              }}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              disabled={loading}
            />
          </>
        )}

        <View style={styles.divider} />

        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>

        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  noUserText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  userInfo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonSecondaryText: {
    color: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#FFF',
  },
});

export default ProfileScreen;

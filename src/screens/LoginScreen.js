/**
 * Login Screen
 */

import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button, ErrorMessage } from '../components/CommonComponents';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    // Trim whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('[LoginScreen] Login attempt with:', trimmedEmail);

    // Check for empty fields
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields');
      console.log('[LoginScreen] Empty fields error');
      return;
    }

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      console.log('[LoginScreen] Invalid email format');
      return;
    }

    // Validate password length
    if (!validatePassword(trimmedPassword)) {
      setError('Password must be at least 8 characters');
      console.log('[LoginScreen] Password too short');
      return;
    }

    setLoading(true);
    setError('');
    console.log('[LoginScreen] Calling AuthContext.login...');
    const result = await login(trimmedEmail, trimmedPassword);

    console.log('[LoginScreen] Login result:', result);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      console.error('[LoginScreen] Login failed:', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sisters Promise</Text>
        <Text style={styles.subtitle}>Natural Skincare</Text>

        {error && <ErrorMessage message={error} />}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginTop: 24,
  },
  label: {
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
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  linkText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 14,
  },
  linkBold: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default LoginScreen;

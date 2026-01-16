/**
 * Auth Context - Global authentication state management
 */

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userData = await authService.getUserData();
        if (userData) {
          setUser(userData);
          // Initialize analytics with user data
          await analyticsService.init();
        }
      } catch (error) {
        logger.log('Bootstrap error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    user,
    isLoading,
    isSignout,
    login: async (email, password) => {
      setIsLoading(true);
      try {
        const response = await authService.login(email, password);
        setUser(response.user);
        setIsSignout(false);
        await analyticsService.trackEvent('user_login', { userId: response.user.id });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.error || 'Login failed' };
      } finally {
        setIsLoading(false);
      }
    },
    register: async (email, password, name) => {
      setIsLoading(true);
      try {
        const response = await authService.register(email, password, name);
        setUser(response.user);
        setIsSignout(false);
        await analyticsService.trackSignup(response.user.id, 'standard');
        return { success: true };
      } catch (error) {
        return { success: false, error: error.error || 'Registration failed' };
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      setIsLoading(true);
      try {
        await authService.logout();
        setUser(null);
        setIsSignout(true);
      } catch (error) {
        logger.error('Logout error:', error);
      } finally {
        setIsLoading(false);
      }
    },
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

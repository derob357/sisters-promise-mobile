/**
 * Sisters Promise Mobile App
 * React Native App for iOS and Android
 */

import React from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { RewardsProvider } from './src/context/RewardsContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import analyticsService from './src/services/analyticsService';
import ErrorBoundary from './src/components/ErrorBoundary';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';

// Suppress known warnings
LogBox.ignoreLogs([
  'Unsanitized script URL string', // From Etsy image URLs with query parameters
  'Non-serializable values were found',
]);

function App() {
  console.log('[App] Rendering');

  // Request tracking permission (iOS 14.5+) and initialize analytics
  React.useEffect(() => {
    const initializeTracking = async () => {
      console.log('[App] Initializing tracking and analytics');

      // Request ATT permission on iOS 14.5+
      if (Platform.OS === 'ios') {
        try {
          const status = await getTrackingStatus();
          console.log('[App] Current tracking status:', status);

          if (status === 'not-determined') {
            const newStatus = await requestTrackingPermission();
            console.log('[App] Tracking permission result:', newStatus);
          }
        } catch (error) {
          console.log('[App] Tracking permission error:', error);
        }
      }

      // Initialize analytics regardless of tracking permission
      // (first-party analytics are allowed without ATT)
      analyticsService.init();
    };

    initializeTracking();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <AuthProvider>
          <RewardsProvider>
            <CartProvider>
              <RootNavigator />
            </CartProvider>
          </RewardsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;

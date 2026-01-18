/**
 * Sisters Promise Mobile App
 * React Native App for iOS and Android
 */

import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import analyticsService from './src/services/analyticsService';
import ErrorBoundary from './src/components/ErrorBoundary';

// Suppress known warnings
LogBox.ignoreLogs([
  'Unsanitized script URL string', // From Etsy image URLs with query parameters
  'Non-serializable values were found',
]);

function App() {
  console.log('[App] Rendering');
  
  // Initialize analytics on app start
  React.useEffect(() => {
    console.log('[App] useEffect: initializing analytics');
    analyticsService.init();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <AuthProvider>
          <CartProvider>
            <RootNavigator />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;

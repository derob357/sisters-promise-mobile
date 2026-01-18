/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Suppress specific console warnings if needed
LogBox.ignoreAllLogs(false);

// Global handler for unhandled promise rejections
const unhandledRejectionHandler = (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
  // Log to a service for production monitoring if needed
};

// Global error handler for uncaught exceptions
const errorHandler = (error, isFatal) => {
  console.error('Global Error Handler:', error);
  console.error('Is Fatal:', isFatal);
  // Log to a service for production monitoring if needed
};

// Register handlers
Promise.allSettled([]).catch(unhandledRejectionHandler);
if (ErrorUtils && ErrorUtils.setGlobalHandler) {
  ErrorUtils.setGlobalHandler(errorHandler);
}

// Catch any unhandled promise rejections
process.on?.('unhandledRejection', unhandledRejectionHandler);

AppRegistry.registerComponent(appName, () => App);

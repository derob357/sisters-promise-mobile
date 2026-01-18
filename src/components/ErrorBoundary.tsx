/**
 * Error Boundary
 * Catches React render errors and displays friendly fallback UI
 */

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import logger from '../utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught error:', error);
    console.error('Component Stack:', errorInfo.componentStack);

    this.setState({
      errorInfo,
    });

    // Log to external service
    logger.error('App Crash', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  handleRestart = async () => {
    try {
      // Try to dynamically import RNRestart
      const RNRestart = require('react-native-restart').default;
      if (RNRestart && RNRestart.restart) {
        RNRestart.restart();
        return;
      }
    } catch (e) {
      // RNRestart not available
    }

    // Fallback: reset state and try to continue
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>😅</Text>
            </View>

            {/* Error Message */}
            <Text style={styles.title}>My bad...</Text>
            <Text style={styles.subtitle}>I ran into an error</Text>

            <Text style={styles.description}>
              Something unexpected happened. Don't worry, it's not your fault!
            </Text>

            {/* Show error details in dev mode */}
            {__DEV__ && this.state.error && (
              <View style={styles.devInfo}>
                <Text style={styles.devLabel}>Error (Dev Only):</Text>
                <Text style={styles.devText} numberOfLines={3}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={this.handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Restart App</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={this.handleTryAgain}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  devInfo: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  devLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  devText: {
    fontSize: 12,
    color: '#BF360C',
    fontFamily: 'Courier',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;

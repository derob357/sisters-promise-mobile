/**
 * Error Boundary
 * Catches React render errors and displays friendly fallback UI
 * Shows detailed logs for admin/owner users
 */

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  userRole: string | null;
  copied: boolean;
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
      userRole: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught error:', error);
    console.error('Component Stack:', errorInfo.componentStack);

    // Get user role from AsyncStorage
    let userRole = null;
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        userRole = user.role;
      }
    } catch (e) {
      // Ignore storage errors
    }

    this.setState({
      errorInfo,
      userRole,
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
      const RNRestart = require('react-native-restart').default;
      if (RNRestart && RNRestart.restart) {
        RNRestart.restart();
        return;
      }
    } catch (e) {
      // RNRestart not available
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  getFullErrorLog = (): string => {
    const { error, errorInfo } = this.state;
    const timestamp = new Date().toISOString();
    const platform = Platform.OS;
    const version = Platform.Version;

    let log = `=== SISTERS PROMISE APP ERROR LOG ===\n`;
    log += `Timestamp: ${timestamp}\n`;
    log += `Platform: ${platform} ${version}\n`;
    log += `\n--- ERROR MESSAGE ---\n`;
    log += `${error?.message || 'Unknown error'}\n`;
    log += `\n--- ERROR NAME ---\n`;
    log += `${error?.name || 'Error'}\n`;
    log += `\n--- STACK TRACE ---\n`;
    log += `${error?.stack || 'No stack trace available'}\n`;
    log += `\n--- COMPONENT STACK ---\n`;
    log += `${errorInfo?.componentStack || 'No component stack available'}\n`;
    log += `\n=== END OF ERROR LOG ===`;

    return log;
  };

  handleCopyLogs = async () => {
    try {
      const logs = this.getFullErrorLog();

      // Try to use Clipboard
      try {
        const ClipboardModule = require('@react-native-clipboard/clipboard').default;
        ClipboardModule.setString(logs);
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 3000);
      } catch (e) {
        // Clipboard not available, show alert with logs
        Alert.alert(
          'Error Logs',
          logs,
          [{ text: 'OK' }],
          { cancelable: true }
        );
      }
    } catch (e) {
      Alert.alert('Error', 'Could not copy logs');
    }
  };

  isAdminOrOwner = (): boolean => {
    const { userRole } = this.state;
    return userRole === 'admin' || userRole === 'owner' || __DEV__;
  };

  renderAdminView = () => {
    const { error, errorInfo, copied } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.adminContent}>
          {/* Header */}
          <View style={styles.adminHeader}>
            <Text style={styles.adminIcon}>🔧</Text>
            <Text style={styles.adminTitle}>Error Report</Text>
            <Text style={styles.adminSubtitle}>Admin/Owner View</Text>
          </View>

          {/* Error Summary */}
          <View style={styles.errorCard}>
            <Text style={styles.cardLabel}>Error Message</Text>
            <Text style={styles.errorMessage}>
              {error?.message || 'Unknown error'}
            </Text>
          </View>

          {/* Stack Trace */}
          <View style={styles.logCard}>
            <Text style={styles.cardLabel}>Stack Trace</Text>
            <ScrollView style={styles.logScroll} nestedScrollEnabled>
              <Text style={styles.logText} selectable>
                {error?.stack || 'No stack trace available'}
              </Text>
            </ScrollView>
          </View>

          {/* Component Stack */}
          <View style={styles.logCard}>
            <Text style={styles.cardLabel}>Component Stack</Text>
            <ScrollView style={styles.logScroll} nestedScrollEnabled>
              <Text style={styles.logText} selectable>
                {errorInfo?.componentStack || 'No component stack available'}
              </Text>
            </ScrollView>
          </View>

          {/* Copy Button */}
          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copyButtonSuccess]}
            onPress={this.handleCopyLogs}
            activeOpacity={0.8}
          >
            <Text style={styles.copyButtonText}>
              {copied ? '✓ Copied to Clipboard!' : 'Copy All Logs'}
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={this.handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Restart App</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={this.handleTryAgain}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  renderUserView = () => {
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
  };

  render() {
    if (this.state.hasError) {
      if (this.isAdminOrOwner()) {
        return this.renderAdminView();
      }
      return this.renderUserView();
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // User View Styles
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
  // Admin View Styles
  adminContent: {
    padding: 16,
    paddingBottom: 32,
  },
  adminHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  adminIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  adminSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  errorMessage: {
    fontSize: 15,
    color: '#C62828',
    fontWeight: '500',
  },
  logCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logScroll: {
    maxHeight: 150,
  },
  logText: {
    fontSize: 11,
    color: '#424242',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  copyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  copyButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#4CAF50',
  },
});

export default ErrorBoundary;

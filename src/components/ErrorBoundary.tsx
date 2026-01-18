/**
 * Error Boundary
 * Catches React render errors and displays fallback UI
 */

import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import logger from '../utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorCount: number;
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
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
    
    // Log to external service if needed
    logger.error('React Error Boundary', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            
            <View style={styles.errorBox}>
              <Text style={styles.errorLabel}>Error:</Text>
              <Text style={styles.errorMessage}>
                {this.state.error?.message || 'Unknown error'}
              </Text>
            </View>

            {__DEV__ && this.state.errorInfo && (
              <View style={styles.stackBox}>
                <Text style={styles.stackLabel}>Stack Trace (Dev Only):</Text>
                <Text style={styles.stackTrace}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}

            {this.state.errorCount > 2 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Multiple errors detected. Please restart the app or check your network connection.
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={this.handleReset}
            >
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
  },
  errorLabel: {
    color: '#c62828',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorMessage: {
    color: '#b71c1c',
    fontSize: 14,
  },
  stackBox: {
    backgroundColor: '#fff3e0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
    maxHeight: 200,
  },
  stackLabel: {
    color: '#e65100',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stackTrace: {
    color: '#bf360c',
    fontSize: 11,
    fontFamily: 'Courier New',
  },
  warningBox: {
    backgroundColor: '#fff9c4',
    borderRadius: 4,
    padding: 12,
    marginBottom: 15,
  },
  warningText: {
    color: '#f57f17',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;

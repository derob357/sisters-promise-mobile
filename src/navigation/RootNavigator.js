/**
 * Root Navigation
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { Spinner } from '../components/CommonComponents';

export const RootNavigator = () => {
  const { isLoading, user, isSignout } = useContext(AuthContext);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <NavigationContainer>
      {user && !isSignout ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

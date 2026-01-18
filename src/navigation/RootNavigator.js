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
  
  console.log('[RootNavigator] isLoading:', isLoading, 'user:', user ? user.email : 'NO USER', 'isSignout:', isSignout);

  if (isLoading) {
    console.log('[RootNavigator] Showing spinner');
    return <Spinner />;
  }

  console.log('[RootNavigator] Rendering navigation container');
  return (
    <NavigationContainer>
      {user && !isSignout ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

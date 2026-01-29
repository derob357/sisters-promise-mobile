/**
 * Root Navigation
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { Spinner } from '../components/CommonComponents';
import logger from '../utils/logger';

export const RootNavigator = () => {
  const { isLoading, user, isSignout } = useContext(AuthContext);
  
  logger.log('[RootNavigator] isLoading:', isLoading, 'user:', user ? user.email : 'NO USER', 'isSignout:', isSignout);

  if (isLoading) {
    logger.log('[RootNavigator] Showing spinner');
    return <Spinner />;
  }

  logger.log('[RootNavigator] Rendering navigation container');
  return (
    <NavigationContainer>
      {user && !isSignout ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

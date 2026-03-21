import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';

/**
 * Entry redirect: authenticated users go to the main app,
 * everyone else goes to the login screen.
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Redirect href="/(authenticated)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

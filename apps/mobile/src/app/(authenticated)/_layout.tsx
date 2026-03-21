import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';
import { UserRole } from '@/types';
import { COLORS } from '@/config/constants';

export default function AuthenticatedLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  // Redirect to the correct tab group based on role
  if (user?.role === UserRole.ADMIN) {
    return (
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
        <Stack.Screen name="(admin-tabs)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
      <Stack.Screen name="(doctor-tabs)" />
    </Stack>
  );
}

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';
import { useOffline } from '@/hooks/useOffline';

export default function OfflineIndicator() {
  const { isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline. Some features may be unavailable.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.warningLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  text: {
    color: COLORS.warning,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});

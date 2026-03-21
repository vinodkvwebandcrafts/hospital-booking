import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES } from '@/config/constants';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  size?: number;
  style?: ViewStyle;
}

export default function Avatar({
  firstName = '',
  lastName = '',
  size = 44,
  style,
}: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

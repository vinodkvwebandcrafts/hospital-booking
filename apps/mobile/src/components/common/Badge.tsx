import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '@/config/constants';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const colorMap: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: COLORS.successLight, text: COLORS.success },
  warning: { bg: COLORS.warningLight, text: COLORS.warning },
  danger: { bg: COLORS.dangerLight, text: COLORS.danger },
  info: { bg: COLORS.infoLight, text: COLORS.info },
  default: { bg: COLORS.primaryLight, text: COLORS.primary },
};

export default function Badge({ label, variant = 'default', style }: BadgeProps) {
  const c = colorMap[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
});

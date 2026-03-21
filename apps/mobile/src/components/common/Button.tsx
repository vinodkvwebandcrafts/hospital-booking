import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '@/config/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: COLORS.primary, text: COLORS.white, border: COLORS.primary },
  secondary: { bg: COLORS.secondary, text: COLORS.white, border: COLORS.secondary },
  outline: { bg: 'transparent', text: COLORS.primary, border: COLORS.primary },
  danger: { bg: COLORS.danger, text: COLORS.white, border: COLORS.danger },
};

const sizeStyles: Record<ButtonSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: SPACING.sm, paddingH: SPACING.lg, fontSize: FONT_SIZES.sm },
  md: { paddingV: SPACING.md, paddingH: SPACING.xl, fontSize: FONT_SIZES.md },
  lg: { paddingV: SPACING.lg, paddingH: SPACING['2xl'], fontSize: FONT_SIZES.lg },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          opacity: isDisabled ? 0.55 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: v.text, fontSize: s.fontSize } as TextStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({
  title,
  showBack = false,
  rightAction,
  style,
}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {showBack ? (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightAction ? <View style={styles.right}>{rightAction}</View> : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  right: {
    width: 60,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 60,
  },
});

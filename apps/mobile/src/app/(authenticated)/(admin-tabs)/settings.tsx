import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function AdminSettingsScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Notification Preferences */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>
                Receive alerts for new appointments and updates
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </Card>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <Card style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2026.03.21</Text>
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  card: { marginBottom: SPACING.md },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: { flex: 1, marginRight: SPACING.md },
  settingLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  settingDesc: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aboutLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  aboutValue: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary },
  logoutBtn: { marginTop: SPACING.xl },
});

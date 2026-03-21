import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function DoctorProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* User Info */}
        <Card style={styles.card}>
          <View style={styles.profileRow}>
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size={72} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                Dr. {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.role}>{user?.role}</Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textMuted}
            />
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
  card: { marginBottom: SPACING.md },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { marginLeft: SPACING.lg, flex: 1 },
  name: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.textPrimary },
  email: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  role: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: { fontSize: FONT_SIZES.md, color: COLORS.textPrimary },
  logoutBtn: { marginTop: SPACING.xl },
});

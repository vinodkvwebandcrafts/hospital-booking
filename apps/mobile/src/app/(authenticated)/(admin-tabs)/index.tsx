import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/common/Card';
import LoadingScreen from '@/components/common/LoadingScreen';
import { getDashboardStats } from '@/services/api/doctors';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function AdminOverviewScreen() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getDashboardStats,
  });

  if (isLoading) return <LoadingScreen />;

  const statCards = [
    { label: 'Doctors', value: stats?.totalDoctors ?? 0, color: COLORS.primary },
    { label: 'Patients', value: stats?.totalPatients ?? 0, color: COLORS.info },
    { label: "Today's Appts", value: stats?.todayAppointments ?? 0, color: COLORS.success },
    {
      label: 'This Month Revenue',
      value: `$${(stats?.revenue ?? 0).toLocaleString()}`,
      color: COLORS.warning,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Hello, {user?.firstName}</Text>
        <Text style={styles.title}>Admin Overview</Text>

        {/* Stats Grid */}
        <View style={styles.grid}>
          {statCards.map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Recent Activity Placeholder */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          <Text style={styles.activityPlaceholder}>
            Activity feed will appear here once the backend provides it.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  greeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    flexGrow: 1,
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  activityCard: {},
  activityPlaceholder: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});

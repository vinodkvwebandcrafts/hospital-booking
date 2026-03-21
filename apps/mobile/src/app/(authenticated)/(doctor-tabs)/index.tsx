import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { router } from 'expo-router';
import Card from '@/components/common/Card';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useTodayAppointments } from '@/hooks/useAppointments';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function DoctorHomeScreen() {
  const { user } = useAuth();
  const { data: todayAppointments, isLoading } = useTodayAppointments();

  if (isLoading) return <LoadingScreen />;

  const nextAppointment = todayAppointments?.[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.content}>
            {/* Welcome Card */}
            <Card style={styles.welcomeCard}>
              <Text style={styles.welcomeLabel}>Welcome back,</Text>
              <Text style={styles.welcomeName}>
                Dr. {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
            </Card>

            {/* Today's Appointments Count */}
            <Card style={styles.countCard}>
              <Text style={styles.countNumber}>{todayAppointments?.length ?? 0}</Text>
              <Text style={styles.countLabel}>Appointments Today</Text>
            </Card>

            {/* Next Appointment */}
            {nextAppointment ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next Appointment</Text>
                <AppointmentCard
                  appointment={nextAppointment}
                  onPress={() =>
                    router.push(
                      `/(authenticated)/(doctor-tabs)/appointments/${nextAppointment.id}` as never,
                    )
                  }
                />
              </View>
            ) : null}

            {/* Quick Stats */}
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{todayAppointments?.length ?? 0}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>--</Text>
                <Text style={styles.statLabel}>Total Patients</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>--</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </Card>
            </View>
          </View>
        }
        keyExtractor={() => 'header'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  welcomeCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  welcomeLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 2,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: SPACING.sm,
  },
  countCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countNumber: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    color: COLORS.primary,
  },
  countLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

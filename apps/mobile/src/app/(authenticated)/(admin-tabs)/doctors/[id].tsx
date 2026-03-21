import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import { getDoctorById, getDoctorPerformance } from '@/services/api/doctors';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminDoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctors', id],
    queryFn: () => getDoctorById(id!),
    enabled: !!id,
  });

  const { data: performance } = useQuery({
    queryKey: ['doctors', id, 'performance'],
    queryFn: () => getDoctorPerformance(id!),
    enabled: !!id,
  });

  if (isLoading || !doctor) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Doctor Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <Avatar
              firstName={doctor.user?.firstName}
              lastName={doctor.user?.lastName}
              size={64}
            />
            <View style={styles.info}>
              <Text style={styles.name}>
                Dr. {doctor.user?.firstName} {doctor.user?.lastName}
              </Text>
              <Text style={styles.meta}>{doctor.specialization}</Text>
              <Badge
                label={doctor.isAvailable ? 'Available' : 'Unavailable'}
                variant={doctor.isAvailable ? 'success' : 'danger'}
                style={{ marginTop: 6 }}
              />
            </View>
          </View>
        </Card>

        {/* Details */}
        <Card style={styles.card}>
          <InfoRow label="License" value={doctor.licenseNumber ?? '--'} />
          <InfoRow label="Clinic" value={doctor.clinicName ?? '--'} />
          <InfoRow label="Address" value={doctor.clinicAddress ?? '--'} />
          <InfoRow
            label="Consultation Fee"
            value={doctor.consultationFee ? `$${doctor.consultationFee}` : '--'}
          />
          <InfoRow label="Avg Duration" value={`${doctor.appointmentDurationMinutes} min`} />
          <InfoRow label="Rating" value={`${doctor.averageRating} (${doctor.totalReviews} reviews)`} />
        </Card>

        {/* Schedule */}
        {doctor.availabilities && doctor.availabilities.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Card style={styles.card}>
              {doctor.availabilities.map((a) => (
                <View key={a.id} style={styles.scheduleRow}>
                  <Text style={styles.dayText}>{DAY_NAMES[a.dayOfWeek]}</Text>
                  <Text style={styles.timeText}>
                    {a.startTime} - {a.endTime}
                  </Text>
                  <Badge
                    label={a.isActive ? 'Active' : 'Off'}
                    variant={a.isActive ? 'success' : 'default'}
                  />
                </View>
              ))}
            </Card>
          </>
        ) : null}

        {/* Performance */}
        {performance ? (
          <>
            <Text style={styles.sectionTitle}>Performance</Text>
            <Card style={styles.card}>
              <InfoRow label="Total Appointments" value={String(performance.totalAppointments)} />
              <InfoRow label="Completed" value={String(performance.completedAppointments)} />
              <InfoRow label="Cancelled" value={String(performance.cancelledAppointments)} />
              <InfoRow label="Revenue" value={`$${performance.revenue.toLocaleString()}`} />
            </Card>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  card: { marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: SPACING.lg, flex: 1 },
  name: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.textPrimary },
  meta: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary, width: 40 },
  timeText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, flex: 1, marginLeft: SPACING.md },
});

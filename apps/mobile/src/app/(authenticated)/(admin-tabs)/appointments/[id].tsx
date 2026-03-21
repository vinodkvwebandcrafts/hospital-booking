import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Header from '@/components/common/Header';
import StatusBadge from '@/components/appointments/StatusBadge';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAppointmentDetail } from '@/hooks/useAppointments';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function AdminAppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appointment, isLoading } = useAppointmentDetail(id!);

  if (isLoading || !appointment) return <LoadingScreen />;

  const doctor = appointment.doctor?.user;
  const patient = appointment.patient;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Appointment Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status */}
        <Card style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Status</Text>
            <StatusBadge status={appointment.status} />
          </View>
        </Card>

        {/* Doctor Info */}
        <Card style={styles.card}>
          <Text style={styles.label}>Doctor</Text>
          <View style={styles.personRow}>
            <Avatar firstName={doctor?.firstName} lastName={doctor?.lastName} size={44} />
            <View style={styles.personInfo}>
              <Text style={styles.personName}>
                Dr. {doctor?.firstName} {doctor?.lastName}
              </Text>
              <Text style={styles.personMeta}>{appointment.doctor?.specialization}</Text>
            </View>
          </View>
        </Card>

        {/* Patient Info */}
        <Card style={styles.card}>
          <Text style={styles.label}>Patient</Text>
          <View style={styles.personRow}>
            <Avatar firstName={patient?.firstName} lastName={patient?.lastName} size={44} />
            <View style={styles.personInfo}>
              <Text style={styles.personName}>
                {patient?.firstName} {patient?.lastName}
              </Text>
              <Text style={styles.personMeta}>{patient?.phone}</Text>
            </View>
          </View>
        </Card>

        {/* Date & Time */}
        <Card style={styles.card}>
          <Text style={styles.label}>Date &amp; Time</Text>
          <Text style={styles.value}>
            {format(new Date(appointment.appointmentDateTime), 'EEEE, MMMM d, yyyy')}
          </Text>
          <Text style={styles.value}>
            {format(new Date(appointment.appointmentDateTime), 'h:mm a')} ({appointment.durationMinutes} min)
          </Text>
        </Card>

        {/* Reason & Notes */}
        {appointment.reason ? (
          <Card style={styles.card}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>{appointment.reason}</Text>
          </Card>
        ) : null}
        {appointment.notes ? (
          <Card style={styles.card}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{appointment.notes}</Text>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  card: { marginBottom: SPACING.md },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personInfo: { marginLeft: SPACING.md, flex: 1 },
  personName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  personMeta: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});

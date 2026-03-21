import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/appointments/StatusBadge';
import { getPatientById } from '@/services/api/doctors';
import { getAppointments } from '@/services/api/appointments';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';
import type { Appointment } from '@/types';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: patient, isLoading: loadingPatient } = useQuery({
    queryKey: ['patients', id],
    queryFn: () => getPatientById(id!),
    enabled: !!id,
  });

  const { data: appointmentsData, isLoading: loadingAppts } = useQuery({
    queryKey: ['appointments', 'patient', id],
    queryFn: () => getAppointments({ patientId: id }),
    enabled: !!id,
  });

  if (loadingPatient || !patient) return <LoadingScreen />;

  const appointments = appointmentsData?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Patient Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Personal Info */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <Avatar firstName={patient.firstName} lastName={patient.lastName} size={64} />
            <View style={styles.info}>
              <Text style={styles.name}>
                {patient.firstName} {patient.lastName}
              </Text>
              <Text style={styles.meta}>{patient.email}</Text>
              <Text style={styles.meta}>{patient.phone}</Text>
              {patient.dateOfBirth ? (
                <Text style={styles.meta}>
                  DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}
                </Text>
              ) : null}
              {patient.gender ? (
                <Text style={styles.meta}>Gender: {patient.gender}</Text>
              ) : null}
            </View>
          </View>
        </Card>

        {/* Appointment History */}
        <Text style={styles.sectionTitle}>Appointment History</Text>
        {loadingAppts ? (
          <LoadingScreen />
        ) : appointments.length === 0 ? (
          <EmptyState title="No Appointments" message="No appointment history found." />
        ) : (
          appointments.map((appt: Appointment) => (
            <Card key={appt.id} style={styles.card}>
              <View style={styles.apptRow}>
                <View style={styles.apptInfo}>
                  <Text style={styles.apptDate}>
                    {format(new Date(appt.appointmentDateTime), 'MMM d, yyyy - h:mm a')}
                  </Text>
                  {appt.reason ? (
                    <Text style={styles.apptReason}>{appt.reason}</Text>
                  ) : null}
                </View>
                <StatusBadge status={appt.status} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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
  apptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apptInfo: { flex: 1, marginRight: SPACING.sm },
  apptDate: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  apptReason: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});

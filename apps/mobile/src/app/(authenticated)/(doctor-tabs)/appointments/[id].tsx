import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import StatusBadge from '@/components/appointments/StatusBadge';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAppointmentDetail, useUpdateAppointment } from '@/hooks/useAppointments';
import { AppointmentStatus } from '@/types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/config/constants';

const STATUS_OPTIONS: AppointmentStatus[] = [
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.CANCELLED,
  AppointmentStatus.NO_SHOW,
];

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appointment, isLoading } = useAppointmentDetail(id!);
  const updateMutation = useUpdateAppointment();

  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | null>(null);
  const [notes, setNotes] = useState('');

  if (isLoading || !appointment) return <LoadingScreen />;

  const patient = appointment.patient;
  const currentStatus = selectedStatus ?? appointment.status;

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        dto: {
          status: currentStatus,
          notes: notes || undefined,
        },
      });
      Alert.alert('Success', 'Appointment updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to update appointment.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Appointment Detail" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Info */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <Avatar
              firstName={patient?.firstName}
              lastName={patient?.lastName}
              size={56}
            />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {patient?.firstName} {patient?.lastName}
              </Text>
              <Text style={styles.patientMeta}>{patient?.phone}</Text>
              <Text style={styles.patientMeta}>{patient?.email}</Text>
            </View>
          </View>
        </Card>

        {/* Date / Time */}
        <Card style={styles.card}>
          <Text style={styles.label}>Date &amp; Time</Text>
          <Text style={styles.value}>
            {format(new Date(appointment.appointmentDateTime), 'EEEE, MMMM d, yyyy')}
          </Text>
          <Text style={styles.value}>
            {format(new Date(appointment.appointmentDateTime), 'h:mm a')} ({appointment.durationMinutes} min)
          </Text>
        </Card>

        {/* Reason */}
        {appointment.reason ? (
          <Card style={styles.card}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>{appointment.reason}</Text>
          </Card>
        ) : null}

        {/* Status Selector */}
        <Card style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSelectedStatus(s)}
                style={[
                  styles.statusChip,
                  currentStatus === s && styles.statusChipActive,
                ]}
              >
                <StatusBadge status={s} />
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Notes */}
        <Card style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about this appointment..."
            placeholderTextColor={COLORS.textMuted}
            value={notes || appointment.notes || ''}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={updateMutation.isPending}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  card: { marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  patientInfo: { marginLeft: SPACING.md, flex: 1 },
  patientName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  patientMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusChip: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  statusChipActive: {
    borderColor: COLORS.primary,
  },
  notesInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

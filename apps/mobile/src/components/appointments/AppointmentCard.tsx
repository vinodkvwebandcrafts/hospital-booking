import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import StatusBadge from './StatusBadge';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';
import type { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  /** Show doctor name instead of patient name (used in admin views). */
  showDoctor?: boolean;
}

export default function AppointmentCard({
  appointment,
  onPress,
  showDoctor = false,
}: AppointmentCardProps) {
  const person = showDoctor ? appointment.doctor?.user : appointment.patient;
  const displayName = person
    ? `${person.firstName} ${person.lastName}`
    : 'Unknown';
  const dateStr = format(new Date(appointment.appointmentDateTime), 'MMM d, yyyy');
  const timeStr = format(new Date(appointment.appointmentDateTime), 'h:mm a');

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar firstName={person?.firstName} lastName={person?.lastName} size={42} />
          <View style={styles.info}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.meta}>
              {dateStr}  {timeStr}
            </Text>
            {appointment.reason ? (
              <Text style={styles.reason} numberOfLines={1}>
                {appointment.reason}
              </Text>
            ) : null}
          </View>
          <StatusBadge status={appointment.status} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reason: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

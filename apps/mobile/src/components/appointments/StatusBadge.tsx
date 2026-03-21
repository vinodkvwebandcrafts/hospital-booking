import React from 'react';
import Badge from '@/components/common/Badge';
import { AppointmentStatus } from '@/types';
import type { ViewStyle } from 'react-native';

interface StatusBadgeProps {
  status: AppointmentStatus;
  style?: ViewStyle;
}

const variantMap: Record<AppointmentStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  [AppointmentStatus.SCHEDULED]: 'info',
  [AppointmentStatus.CONFIRMED]: 'default',
  [AppointmentStatus.COMPLETED]: 'success',
  [AppointmentStatus.CANCELLED]: 'danger',
  [AppointmentStatus.NO_SHOW]: 'warning',
};

const labelMap: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Scheduled',
  [AppointmentStatus.CONFIRMED]: 'Confirmed',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELLED]: 'Cancelled',
  [AppointmentStatus.NO_SHOW]: 'No Show',
};

export default function StatusBadge({ status, style }: StatusBadgeProps) {
  return <Badge label={labelMap[status]} variant={variantMap[status]} style={style} />;
}

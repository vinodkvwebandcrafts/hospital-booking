export enum NotificationType {
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  MEDICAL_RECORD_READY = 'MEDICAL_RECORD_READY',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface RegisterDeviceDto {
  pushToken: string;
  deviceType: 'ios' | 'android';
}

export interface SendNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, string>;
}

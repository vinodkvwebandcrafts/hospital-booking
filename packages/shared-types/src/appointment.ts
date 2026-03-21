export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum ConsultationType {
  IN_PERSON = 'IN_PERSON',
  VIDEO_CALL = 'VIDEO_CALL',
  PHONE = 'PHONE',
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDateTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  consultationType: ConsultationType;
  consultationFee?: number;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  doctor?: import('./doctor').Doctor;
  patient?: import('./user').User;
}

export interface CreateAppointmentDto {
  doctorId: string;
  appointmentDateTime: string;
  durationMinutes?: number;
  reason?: string;
  consultationType?: ConsultationType;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  notes?: string;
  appointmentDateTime?: string;
  reason?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isLocked: boolean;
}

export interface AvailableSlotsQuery {
  doctorId: string;
  date: string;
}

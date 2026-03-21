/**
 * Re-export every shared type so the rest of the app can import from
 * `@/types` instead of reaching into the shared-types package directly.
 */
export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  AuthResponse,
  RegisterDto,
} from '@hospital-booking/shared-types';

export {
  UserRole,
  AppointmentStatus,
  ConsultationType,
  NotificationType,
} from '@hospital-booking/shared-types';

export type {
  Doctor,
  DoctorAvailability,
  CreateDoctorDto,
  UpdateDoctorDto,
  SetAvailabilityDto,
  DoctorFilterQuery,
} from '@hospital-booking/shared-types';

export type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  TimeSlot,
  AvailableSlotsQuery,
} from '@hospital-booking/shared-types';

export type {
  MedicalRecord,
  Prescription,
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from '@hospital-booking/shared-types';

export type {
  Notification,
  RegisterDeviceDto,
  SendNotificationDto,
} from '@hospital-booking/shared-types';

export type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
  PaginationMeta,
  PaginationQuery,
  DashboardStats,
  DoctorPerformance,
} from '@hospital-booking/shared-types';

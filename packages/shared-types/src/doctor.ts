import { User } from './user';

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber?: string;
  bio?: string;
  averageRating: number;
  totalReviews: number;
  appointmentDurationMinutes: number;
  consultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  availabilities?: DoctorAvailability[];
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Monday, 6 = Sunday
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isActive: boolean;
}

export interface CreateDoctorDto {
  userId: string;
  specialization: string;
  licenseNumber?: string;
  bio?: string;
  appointmentDurationMinutes?: number;
  consultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
}

export interface UpdateDoctorDto {
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
  appointmentDurationMinutes?: number;
  consultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
  isAvailable?: boolean;
}

export interface SetAvailabilityDto {
  availabilities: Omit<DoctorAvailability, 'id' | 'doctorId'>[];
}

export interface DoctorFilterQuery {
  specialization?: string;
  isAvailable?: boolean;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

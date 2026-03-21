import apiClient from './client';
import type {
  Appointment,
  UpdateAppointmentDto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export interface AppointmentFilters {
  status?: string;
  date?: string;
  doctorId?: string;
  patientId?: string;
  page?: number;
  limit?: number;
}

/** Fetch a paginated list of appointments. */
export async function getAppointments(
  filters?: AppointmentFilters,
): Promise<PaginatedResponse<Appointment>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
    '/appointments',
    { params: filters },
  );
  return data.data;
}

/** Fetch appointments for today. */
export async function getTodayAppointments(): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await apiClient.get<ApiResponse<Appointment[]>>(
    '/appointments',
    { params: { date: today } },
  );
  return data.data;
}

/** Fetch a single appointment by id. */
export async function getAppointmentById(id: string): Promise<Appointment> {
  const { data } = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
  return data.data;
}

/** Update appointment status or notes. */
export async function updateAppointment(
  id: string,
  dto: UpdateAppointmentDto,
): Promise<Appointment> {
  const { data } = await apiClient.patch<ApiResponse<Appointment>>(
    `/appointments/${id}`,
    dto,
  );
  return data.data;
}

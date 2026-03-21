import apiClient from './client';
import type {
  Doctor,
  DoctorFilterQuery,
  ApiResponse,
  PaginatedResponse,
  DoctorPerformance,
  DashboardStats,
  User,
} from '@/types';

/** Fetch paginated list of doctors. */
export async function getDoctors(
  filters?: DoctorFilterQuery,
): Promise<PaginatedResponse<Doctor>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>(
    '/doctors',
    { params: filters },
  );
  return data.data;
}

/** Fetch a single doctor by id. */
export async function getDoctorById(id: string): Promise<Doctor> {
  const { data } = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  return data.data;
}

/** Fetch doctor performance stats (admin). */
export async function getDoctorPerformance(id: string): Promise<DoctorPerformance> {
  const { data } = await apiClient.get<ApiResponse<DoctorPerformance>>(
    `/doctors/${id}/performance`,
  );
  return data.data;
}

/** Fetch admin dashboard stats. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard');
  return data.data;
}

/** Fetch patients list (for doctors). */
export async function getPatients(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
    '/patients',
    { params },
  );
  return data.data;
}

/** Fetch a single patient by id. */
export async function getPatientById(id: string): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/patients/${id}`);
  return data.data;
}

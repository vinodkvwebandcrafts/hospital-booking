import type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  AppointmentStatus,
} from '@hospital-booking/shared-types';
import { apiClient } from './client';

export interface AppointmentQuery extends PaginationQuery {
  status?: AppointmentStatus;
  doctorId?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const appointmentApi = {
  async list(query?: AppointmentQuery): Promise<PaginatedResponse<Appointment>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
      '/appointments',
      { params: query },
    );
    return data.data;
  },

  async getById(id: string): Promise<Appointment> {
    const { data } = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return data.data;
  },

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data } = await apiClient.post<ApiResponse<Appointment>>('/appointments', dto);
    return data.data;
  },

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const { data } = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}`, dto);
    return data.data;
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const { data } = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/status`,
      { status },
    );
    return data.data;
  },

  async getByDoctor(
    doctorId: string,
    query?: PaginationQuery,
  ): Promise<PaginatedResponse<Appointment>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
      `/doctors/${doctorId}/appointments`,
      { params: query },
    );
    return data.data;
  },

  async getByPatient(
    patientId: string,
    query?: PaginationQuery,
  ): Promise<PaginatedResponse<Appointment>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
      `/patients/${patientId}/appointments`,
      { params: query },
    );
    return data.data;
  },
};

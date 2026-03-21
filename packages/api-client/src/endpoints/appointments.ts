import { AxiosInstance } from 'axios';
import type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentStatus,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from '@hospital-booking/shared-types';

export interface AppointmentFilters extends PaginationQuery {
  status?: AppointmentStatus;
  doctorId?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function createAppointmentsApi(client: AxiosInstance) {
  return {
    getAll: async (filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', {
        params: filters,
      });
      return res.data.data;
    },

    getById: async (id: string): Promise<Appointment> => {
      const res = await client.get<ApiResponse<Appointment>>(`/appointments/${id}`);
      return res.data.data;
    },

    getMyAppointments: async (
      filters?: AppointmentFilters,
    ): Promise<PaginatedResponse<Appointment>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<Appointment>>>(
        '/appointments/my',
        { params: filters },
      );
      return res.data.data;
    },

    create: async (data: CreateAppointmentDto): Promise<Appointment> => {
      const res = await client.post<ApiResponse<Appointment>>('/appointments', data);
      return res.data.data;
    },

    update: async (id: string, data: UpdateAppointmentDto): Promise<Appointment> => {
      const res = await client.patch<ApiResponse<Appointment>>(`/appointments/${id}`, data);
      return res.data.data;
    },

    cancel: async (id: string): Promise<Appointment> => {
      const res = await client.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
      return res.data.data;
    },

    updateStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
      const res = await client.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, {
        status,
      });
      return res.data.data;
    },

    getDoctorAppointments: async (
      doctorId: string,
      filters?: AppointmentFilters,
    ): Promise<PaginatedResponse<Appointment>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<Appointment>>>(
        `/appointments/doctor/${doctorId}`,
        { params: filters },
      );
      return res.data.data;
    },
  };
}

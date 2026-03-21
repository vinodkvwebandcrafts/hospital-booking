import { AxiosInstance } from 'axios';
import type {
  Doctor,
  DoctorFilterQuery,
  CreateDoctorDto,
  UpdateDoctorDto,
  SetAvailabilityDto,
  TimeSlot,
  ApiResponse,
  PaginatedResponse,
} from '@hospital-booking/shared-types';

export function createDoctorsApi(client: AxiosInstance) {
  return {
    getAll: async (filters?: DoctorFilterQuery): Promise<PaginatedResponse<Doctor>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<Doctor>>>('/doctors', {
        params: filters,
      });
      return res.data.data;
    },

    getById: async (id: string): Promise<Doctor> => {
      const res = await client.get<ApiResponse<Doctor>>(`/doctors/${id}`);
      return res.data.data;
    },

    create: async (data: CreateDoctorDto): Promise<Doctor> => {
      const res = await client.post<ApiResponse<Doctor>>('/doctors', data);
      return res.data.data;
    },

    update: async (id: string, data: UpdateDoctorDto): Promise<Doctor> => {
      const res = await client.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data);
      return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await client.delete(`/doctors/${id}`);
    },

    setAvailability: async (id: string, data: SetAvailabilityDto): Promise<void> => {
      await client.post(`/doctors/${id}/availability`, data);
    },

    getAvailableSlots: async (id: string, date: string): Promise<TimeSlot[]> => {
      const res = await client.get<ApiResponse<TimeSlot[]>>(`/doctors/${id}/slots`, {
        params: { date },
      });
      return res.data.data;
    },
  };
}

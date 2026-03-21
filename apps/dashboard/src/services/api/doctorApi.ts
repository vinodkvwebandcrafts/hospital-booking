import type {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  SetAvailabilityDto,
  DoctorFilterQuery,
  ApiResponse,
  PaginatedResponse,
} from '@hospital-booking/shared-types';
import { apiClient } from './client';

export const doctorApi = {
  async list(query?: DoctorFilterQuery): Promise<PaginatedResponse<Doctor>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>('/doctors', {
      params: query,
    });
    return data.data;
  },

  async getById(id: string): Promise<Doctor> {
    const { data } = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return data.data;
  },

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const { data } = await apiClient.post<ApiResponse<Doctor>>('/doctors', dto);
    return data.data;
  },

  async update(id: string, dto: UpdateDoctorDto): Promise<Doctor> {
    const { data } = await apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}`, dto);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/doctors/${id}`);
  },

  async setAvailability(id: string, dto: SetAvailabilityDto): Promise<void> {
    await apiClient.put(`/doctors/${id}/availability`, dto);
  },
};

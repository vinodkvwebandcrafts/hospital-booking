import type {
  User,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from '@hospital-booking/shared-types';
import { apiClient } from './client';

export interface PatientQuery extends PaginationQuery {
  search?: string;
}

export const patientApi = {
  async list(query?: PatientQuery): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/patients', {
      params: query,
    });
    return data.data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(`/patients/${id}`);
    return data.data;
  },
};

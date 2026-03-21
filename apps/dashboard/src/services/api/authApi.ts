import type { LoginDto, AuthResponse, ApiResponse } from '@hospital-booking/shared-types';
import { apiClient } from './client';

export const authApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken },
    );
    return data.data;
  },
};

import { AxiosInstance } from 'axios';
import type { AuthResponse, LoginDto, RegisterDto, ApiResponse } from '@hospital-booking/shared-types';

export function createAuthApi(client: AxiosInstance) {
  return {
    login: async (data: LoginDto): Promise<AuthResponse> => {
      const res = await client.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return res.data.data;
    },

    register: async (data: RegisterDto): Promise<AuthResponse> => {
      const res = await client.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return res.data.data;
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
      const res = await client.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
        refreshToken,
      });
      return res.data.data;
    },

    forgotPassword: async (email: string): Promise<void> => {
      await client.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
      await client.post('/auth/reset-password', { token, password });
    },
  };
}

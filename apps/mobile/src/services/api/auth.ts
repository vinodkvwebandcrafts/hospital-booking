import apiClient from './client';
import type { LoginDto, RegisterDto, AuthResponse, ApiResponse } from '@/types';

/** Authenticate an existing user. */
export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', dto);
  return data.data;
}

/** Register a new user account. */
export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', dto);
  return data.data;
}

/** Request a new access token using a refresh token. */
export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
    refreshToken,
  });
  return data.data;
}

'use client';

import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, AuthResponse, LoginDto, RegisterDto } from '@hospital-booking/shared-types';
import api from '@/lib/api';
import { AUTH_TOKEN_KEY, AUTH_REFRESH_KEY } from '@/lib/constants';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_REFRESH_KEY, refreshToken);
  document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

function clearTokens() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function useCurrentUser() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (!token) return null;

      try {
        const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
        setUser(data.data);
        return data.data;
      } catch {
        clearTokens();
        setUser(null);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', dto);
      return data.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(['currentUser'], data.user);
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Login failed. Please check your credentials.');
    },
  });
}

export function useRegister() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', dto);
      return data.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(['currentUser'], data.user);
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Registration failed. Please try again.');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    clearTokens();
    clearAuth();
    queryClient.clear();
    window.location.href = '/login';
  };
}

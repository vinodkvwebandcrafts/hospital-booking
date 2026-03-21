'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Appointment,
  CreateAppointmentDto,
  AppointmentStatus,
  ApiResponse,
  PaginatedResponse,
} from '@hospital-booking/shared-types';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useMyAppointments(status?: AppointmentStatus) {
  return useQuery({
    queryKey: ['myAppointments', status],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments/my', {
        params: status ? { status } : undefined,
      });
      return data.data;
    },
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateAppointmentDto) => {
      const { data } = await api.post<ApiResponse<Appointment>>('/appointments', dto);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      toast.success('Appointment booked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to book appointment.');
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      toast.success('Appointment cancelled.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to cancel appointment.');
    },
  });
}

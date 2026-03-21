'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  Doctor,
  DoctorFilterQuery,
  TimeSlot,
  ApiResponse,
  PaginatedResponse,
} from '@hospital-booking/shared-types';
import api from '@/lib/api';

export function useDoctors(filters?: DoctorFilterQuery) {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Doctor>>>('/doctors', {
        params: filters,
      });
      return data.data;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDoctorSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ['doctorSlots', doctorId, date],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TimeSlot[]>>(`/doctors/${doctorId}/slots`, {
        params: { date },
      });
      return data.data;
    },
    enabled: !!doctorId && !!date,
  });
}

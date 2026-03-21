'use client';

import { useQuery } from '@tanstack/react-query';
import type { MedicalRecord, ApiResponse, PaginatedResponse } from '@hospital-booking/shared-types';
import api from '@/lib/api';

export function useMyRecords() {
  return useQuery({
    queryKey: ['myRecords'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<MedicalRecord>>>('/medical-records/my');
      return data.data;
    },
  });
}

export function useRecord(id: string) {
  return useQuery({
    queryKey: ['record', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

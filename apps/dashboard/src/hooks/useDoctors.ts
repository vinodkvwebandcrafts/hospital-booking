import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilterQuery,
  SetAvailabilityDto,
} from '@hospital-booking/shared-types';
import { doctorApi } from '@/services/api/doctorApi';

const DOCTORS_KEY = ['doctors'] as const;

export function useDoctors(query?: DoctorFilterQuery) {
  return useQuery({
    queryKey: [...DOCTORS_KEY, query],
    queryFn: () => doctorApi.list(query),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: [...DOCTORS_KEY, id],
    queryFn: () => doctorApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDoctorDto) => doctorApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_KEY });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDoctorDto }) => doctorApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_KEY });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_KEY });
    },
  });
}

export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SetAvailabilityDto }) =>
      doctorApi.setAvailability(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_KEY });
    },
  });
}

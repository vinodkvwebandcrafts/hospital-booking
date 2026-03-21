import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodayAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  type AppointmentFilters,
} from '@/services/api/appointments';
import type { UpdateAppointmentDto } from '@/types';

/** Today's appointments for the logged-in doctor. */
export function useTodayAppointments() {
  return useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: getTodayAppointments,
  });
}

/** Paginated / filtered list of appointments. */
export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => getAppointments(filters),
  });
}

/** Single appointment detail. */
export function useAppointmentDetail(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => getAppointmentById(id),
    enabled: !!id,
  });
}

/** Mutation for updating an appointment (status, notes, etc.). */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAppointmentDto }) =>
      updateAppointment(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

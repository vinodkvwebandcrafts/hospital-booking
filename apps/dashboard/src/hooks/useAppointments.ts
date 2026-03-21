import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentStatus,
  PaginationQuery,
} from '@hospital-booking/shared-types';
import { appointmentApi, type AppointmentQuery } from '@/services/api/appointmentApi';

const APPOINTMENTS_KEY = ['appointments'] as const;

export function useAppointments(query?: AppointmentQuery) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, query],
    queryFn: () => appointmentApi.list(query),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, id],
    queryFn: () => appointmentApi.getById(id),
    enabled: !!id,
  });
}

export function useDoctorAppointments(doctorId: string, query?: PaginationQuery) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, 'doctor', doctorId, query],
    queryFn: () => appointmentApi.getByDoctor(doctorId, query),
    enabled: !!doctorId,
  });
}

export function usePatientAppointments(patientId: string, query?: PaginationQuery) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, 'patient', patientId, query],
    queryFn: () => appointmentApi.getByPatient(patientId, query),
    enabled: !!patientId,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAppointmentDto) => appointmentApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAppointmentDto }) =>
      appointmentApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { patientApi, type PatientQuery } from '@/services/api/patientApi';

const PATIENTS_KEY = ['patients'] as const;

export function usePatients(query?: PatientQuery) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, query],
    queryFn: () => patientApi.list(query),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, id],
    queryFn: () => patientApi.getById(id),
    enabled: !!id,
  });
}

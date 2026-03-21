import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/api/analyticsApi';

const ANALYTICS_KEY = ['analytics'] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'dashboard'],
    queryFn: () => analyticsApi.getDashboardStats(),
  });
}

export function useDoctorPerformance() {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'doctor-performance'],
    queryFn: () => analyticsApi.getDoctorPerformance(),
  });
}

export function useAppointmentTrends(days?: number) {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'appointment-trends', days],
    queryFn: () => analyticsApi.getAppointmentTrends(days),
  });
}

export function useRevenueTrends() {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'revenue'],
    queryFn: () => analyticsApi.getRevenueTrends(),
  });
}

export function usePatientGrowth() {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'patient-growth'],
    queryFn: () => analyticsApi.getPatientGrowth(),
  });
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: [...ANALYTICS_KEY, 'status-distribution'],
    queryFn: () => analyticsApi.getStatusDistribution(),
  });
}

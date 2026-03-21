import type {
  DashboardStats,
  DoctorPerformance,
  ApiResponse,
} from '@hospital-booking/shared-types';
import { apiClient } from './client';

export interface AppointmentTrend {
  date: string;
  count: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
}

export interface PatientGrowth {
  month: string;
  total: number;
  newPatients: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export const analyticsApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
    return data.data;
  },

  async getDoctorPerformance(): Promise<DoctorPerformance[]> {
    const { data } = await apiClient.get<ApiResponse<DoctorPerformance[]>>(
      '/analytics/doctor-performance',
    );
    return data.data;
  },

  async getAppointmentTrends(days?: number): Promise<AppointmentTrend[]> {
    const { data } = await apiClient.get<ApiResponse<AppointmentTrend[]>>(
      '/analytics/appointment-trends',
      { params: { days } },
    );
    return data.data;
  },

  async getRevenueTrends(): Promise<RevenueTrend[]> {
    const { data } = await apiClient.get<ApiResponse<RevenueTrend[]>>('/analytics/revenue');
    return data.data;
  },

  async getPatientGrowth(): Promise<PatientGrowth[]> {
    const { data } = await apiClient.get<ApiResponse<PatientGrowth[]>>(
      '/analytics/patient-growth',
    );
    return data.data;
  },

  async getStatusDistribution(): Promise<StatusDistribution[]> {
    const { data } = await apiClient.get<ApiResponse<StatusDistribution[]>>(
      '/analytics/status-distribution',
    );
    return data.data;
  },
};

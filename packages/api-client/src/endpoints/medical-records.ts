import { AxiosInstance } from 'axios';
import type {
  MedicalRecord,
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from '@hospital-booking/shared-types';

export function createMedicalRecordsApi(client: AxiosInstance) {
  return {
    getByPatient: async (
      patientId: string,
      pagination?: PaginationQuery,
    ): Promise<PaginatedResponse<MedicalRecord>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<MedicalRecord>>>(
        `/medical-records/patient/${patientId}`,
        { params: pagination },
      );
      return res.data.data;
    },

    getMyRecords: async (
      pagination?: PaginationQuery,
    ): Promise<PaginatedResponse<MedicalRecord>> => {
      const res = await client.get<ApiResponse<PaginatedResponse<MedicalRecord>>>(
        '/medical-records/my',
        { params: pagination },
      );
      return res.data.data;
    },

    getById: async (id: string): Promise<MedicalRecord> => {
      const res = await client.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
      return res.data.data;
    },

    getByAppointment: async (appointmentId: string): Promise<MedicalRecord> => {
      const res = await client.get<ApiResponse<MedicalRecord>>(
        `/medical-records/appointment/${appointmentId}`,
      );
      return res.data.data;
    },

    create: async (data: CreateMedicalRecordDto): Promise<MedicalRecord> => {
      const res = await client.post<ApiResponse<MedicalRecord>>('/medical-records', data);
      return res.data.data;
    },

    update: async (id: string, data: UpdateMedicalRecordDto): Promise<MedicalRecord> => {
      const res = await client.patch<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data);
      return res.data.data;
    },

    uploadAttachment: async (id: string, file: FormData): Promise<{ url: string }> => {
      const res = await client.post<ApiResponse<{ url: string }>>(
        `/medical-records/${id}/attachment`,
        file,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return res.data.data;
    },
  };
}

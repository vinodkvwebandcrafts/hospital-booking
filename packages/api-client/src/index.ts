import { AxiosInstance } from 'axios';
import { createApiClient, ApiClientConfig } from './client';
import { createAuthApi } from './endpoints/auth';
import { createDoctorsApi } from './endpoints/doctors';
import { createAppointmentsApi } from './endpoints/appointments';
import { createMedicalRecordsApi } from './endpoints/medical-records';

export { createApiClient } from './client';
export type { ApiClientConfig } from './client';
export { createAuthApi } from './endpoints/auth';
export { createDoctorsApi } from './endpoints/doctors';
export { createAppointmentsApi, type AppointmentFilters } from './endpoints/appointments';
export { createMedicalRecordsApi } from './endpoints/medical-records';

export interface HospitalApi {
  client: AxiosInstance;
  auth: ReturnType<typeof createAuthApi>;
  doctors: ReturnType<typeof createDoctorsApi>;
  appointments: ReturnType<typeof createAppointmentsApi>;
  medicalRecords: ReturnType<typeof createMedicalRecordsApi>;
}

export function createHospitalApi(config: ApiClientConfig): HospitalApi {
  const client = createApiClient(config);

  return {
    client,
    auth: createAuthApi(client),
    doctors: createDoctorsApi(client),
    appointments: createAppointmentsApi(client),
    medicalRecords: createMedicalRecordsApi(client),
  };
}

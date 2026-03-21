export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  treatmentPlan?: string;
  prescriptions?: Prescription[];
  labResults?: string;
  attachmentUrls?: string[];
  isConfidential: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface CreateMedicalRecordDto {
  appointmentId: string;
  patientId: string;
  symptoms: string;
  diagnosis: string;
  treatmentPlan?: string;
  prescriptions?: Prescription[];
  labResults?: string;
  isConfidential?: boolean;
}

export interface UpdateMedicalRecordDto {
  symptoms?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: Prescription[];
  labResults?: string;
  isConfidential?: boolean;
}

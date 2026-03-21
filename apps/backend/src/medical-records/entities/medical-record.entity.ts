import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { DoctorEntity } from '../../doctors/entities/doctor.entity';

@Entity('medical_records')
@Index('IDX_medical_record_patient', ['patientId'])
@Index('IDX_medical_record_doctor', ['doctorId'])
export class MedicalRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'appointment_id' })
  appointmentId: string;

  @OneToOne(() => AppointmentEntity)
  @JoinColumn({ name: 'appointment_id' })
  appointment: AppointmentEntity;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: UserEntity;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ name: 'treatment_plan', type: 'text', nullable: true })
  treatmentPlan: string;

  @Column({ type: 'json', nullable: true })
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];

  @Column({ name: 'lab_results', type: 'text', nullable: true })
  labResults: string;

  @Column({ name: 'attachment_urls', type: 'simple-json', nullable: true })
  attachmentUrls: string[];

  @Column({ name: 'is_confidential', default: false })
  isConfidential: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

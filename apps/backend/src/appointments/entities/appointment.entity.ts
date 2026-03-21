import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DoctorEntity } from '../../doctors/entities/doctor.entity';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum ConsultationType {
  IN_PERSON = 'IN_PERSON',
  VIDEO_CALL = 'VIDEO_CALL',
  PHONE = 'PHONE',
}

@Entity('appointments')
@Unique('UQ_doctor_appointment_datetime', ['doctorId', 'appointmentDateTime'])
@Index('IDX_appointment_patient', ['patientId'])
@Index('IDX_appointment_doctor', ['doctorId'])
@Index('IDX_appointment_status', ['status'])
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => DoctorEntity, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: UserEntity;

  @Column({ name: 'appointment_date_time', type: 'timestamp with time zone' })
  appointmentDateTime: Date;

  @Column({ name: 'duration_minutes', default: 30 })
  durationMinutes: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    name: 'consultation_type',
    type: 'enum',
    enum: ConsultationType,
    default: ConsultationType.IN_PERSON,
  })
  consultationType: ConsultationType;

  @Column({
    name: 'consultation_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  consultationFee: number;

  @Column({ name: 'meeting_link', nullable: true })
  meetingLink: string;

  @Column({ name: 'reminder_sent', default: false })
  reminderSent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp with time zone', nullable: true })
  cancelledAt: Date;
}

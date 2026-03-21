import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AvailabilityEntity } from './availability.entity';

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  specialization: string;

  @Column({ name: 'license_number', nullable: true })
  licenseNumber: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  averageRating: number;

  @Column({ name: 'total_reviews', default: 0 })
  totalReviews: number;

  @Column({ name: 'appointment_duration_minutes', default: 30 })
  appointmentDurationMinutes: number;

  @Column({
    name: 'consultation_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  consultationFee: number;

  @Column({ name: 'clinic_name', nullable: true })
  clinicName: string;

  @Column({ name: 'clinic_address', nullable: true })
  clinicAddress: string;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @OneToMany(() => AvailabilityEntity, (availability) => availability.doctor, {
    cascade: true,
  })
  availabilities: AvailabilityEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

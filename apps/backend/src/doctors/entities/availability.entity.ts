import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('doctor_availabilities')
export class AvailabilityEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'doctor_id' })
  doctorId!: string;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.availabilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: DoctorEntity;

  @Column({ name: 'day_of_week', type: 'int' })
  dayOfWeek!: number;

  @Column({ name: 'start_time', type: 'varchar', length: 5 })
  startTime!: string;

  @Column({ name: 'end_time', type: 'varchar', length: 5 })
  endTime!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}

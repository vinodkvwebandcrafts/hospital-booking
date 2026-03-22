import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorEntity } from './entities/doctor.entity';
import { AvailabilityEntity } from './entities/availability.entity';
import { AppointmentEntity } from '../appointments/entities/appointment.entity';
import { SlotLockingService } from '../appointments/slot-locking/slot-locking.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity, AvailabilityEntity, AppointmentEntity])],
  controllers: [DoctorsController],
  providers: [DoctorsService, SlotLockingService],
  exports: [DoctorsService],
})
export class DoctorsModule {}

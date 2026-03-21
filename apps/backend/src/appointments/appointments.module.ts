import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentEntity } from './entities/appointment.entity';
import { SlotLockingService } from './slot-locking/slot-locking.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity]),
    DoctorsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, SlotLockingService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorEntity } from './entities/doctor.entity';
import { AvailabilityEntity } from './entities/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity, AvailabilityEntity])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicalRecordEntity } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecordEntity)
    private readonly medicalRecordsRepository: Repository<MedicalRecordEntity>,
    private readonly doctorsService: DoctorsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createDto: CreateMedicalRecordDto,
    doctorUserId: string,
  ): Promise<MedicalRecordEntity> {
    const doctor = await this.doctorsService.findByUserId(doctorUserId);

    if (!doctor) {
      throw new ForbiddenException('Only doctors can create medical records');
    }

    const record = this.medicalRecordsRepository.create({
      ...createDto,
      doctorId: doctor.id,
    });

    const saved = await this.medicalRecordsRepository.save(record);

    this.eventEmitter.emit('medical-record.created', {
      record: saved,
      patientId: createDto.patientId,
    });

    return this.findById(saved.id);
  }

  async findById(id: string): Promise<MedicalRecordEntity> {
    const record = await this.medicalRecordsRepository.findOne({
      where: { id },
      relations: ['appointment', 'patient', 'doctor', 'doctor.user'],
    });

    if (!record) {
      throw new NotFoundException(`Medical record with id ${id} not found`);
    }

    return record;
  }

  async findByPatient(
    patientId: string,
    requestingUserId: string,
    requestingUserRole: string,
  ): Promise<MedicalRecordEntity[]> {
    if (requestingUserRole === 'PATIENT' && requestingUserId !== patientId) {
      throw new ForbiddenException('You can only view your own medical records');
    }

    const where: any = { patientId };

    if (requestingUserRole === 'DOCTOR') {
      const doctor = await this.doctorsService.findByUserId(requestingUserId);
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }

    return this.medicalRecordsRepository.find({
      where,
      relations: ['appointment', 'patient', 'doctor', 'doctor.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAppointment(
    appointmentId: string,
  ): Promise<MedicalRecordEntity | null> {
    return this.medicalRecordsRepository.findOne({
      where: { appointmentId },
      relations: ['appointment', 'patient', 'doctor', 'doctor.user'],
    });
  }

  async update(
    id: string,
    updateDto: UpdateMedicalRecordDto,
    doctorUserId: string,
  ): Promise<MedicalRecordEntity> {
    const record = await this.findById(id);
    const doctor = await this.doctorsService.findByUserId(doctorUserId);

    if (!doctor || record.doctorId !== doctor.id) {
      throw new ForbiddenException(
        'Only the treating doctor can update this medical record',
      );
    }

    Object.assign(record, updateDto);
    await this.medicalRecordsRepository.save(record);

    return this.findById(id);
  }
}

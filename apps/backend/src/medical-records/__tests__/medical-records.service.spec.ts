import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MedicalRecordsService } from '../medical-records.service';
import { MedicalRecordEntity } from '../entities/medical-record.entity';
import { DoctorsService } from '../../doctors/doctors.service';

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;
  let mockRepo: Record<string, jest.Mock>;
  let mockDoctors: Record<string, jest.Mock>;
  let mockEmitter: Record<string, jest.Mock>;

  const mockDoctor = {
    id: 'doctor-uuid-1',
    userId: 'user-uuid-doctor',
    specialization: 'General',
    user: {
      id: 'user-uuid-doctor',
      firstName: 'James',
      lastName: 'Smith',
    },
  };

  const mockRecord: Partial<MedicalRecordEntity> = {
    id: 'record-uuid-1',
    appointmentId: 'appt-uuid-1',
    patientId: 'patient-uuid-1',
    doctorId: 'doctor-uuid-1',
    symptoms: 'Headache, fever',
    diagnosis: 'Upper respiratory infection',
    treatmentPlan: 'Rest and fluids',
    prescriptions: [
      {
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days',
      },
    ],
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-20'),
  };

  const mockRecordWithRelations = {
    ...mockRecord,
    patient: { id: 'patient-uuid-1', firstName: 'Jane', lastName: 'Doe' },
    doctor: mockDoctor,
    appointment: { id: 'appt-uuid-1' },
  };

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockResolvedValue(mockRecord),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mockDoctors = {
      findByUserId: jest.fn(),
    };

    mockEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordsService,
        { provide: getRepositoryToken(MedicalRecordEntity), useValue: mockRepo },
        { provide: DoctorsService, useValue: mockDoctors },
        { provide: EventEmitter2, useValue: mockEmitter },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- create ----------
  describe('create', () => {
    const createDto = {
      appointmentId: 'appt-uuid-1',
      patientId: 'patient-uuid-1',
      symptoms: 'Headache, fever',
      diagnosis: 'Upper respiratory infection',
      treatmentPlan: 'Rest and fluids',
      prescriptions: [
        {
          medication: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '7 days',
        },
      ],
    };

    it('should create a medical record when user is a doctor', async () => {
      mockDoctors.findByUserId.mockResolvedValue(mockDoctor);
      mockRepo.save.mockResolvedValue({ ...mockRecord, id: 'record-uuid-1' });
      mockRepo.findOne.mockResolvedValue(mockRecordWithRelations);

      const result = await service.create(createDto, 'user-uuid-doctor');

      expect(mockDoctors.findByUserId).toHaveBeenCalledWith('user-uuid-doctor');
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          doctorId: 'doctor-uuid-1',
        }),
      );
      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'medical-record.created',
        expect.objectContaining({
          record: expect.any(Object),
          patientId: 'patient-uuid-1',
        }),
      );
      expect(result).toEqual(mockRecordWithRelations);
    });

    it('should throw ForbiddenException when user is not a doctor', async () => {
      mockDoctors.findByUserId.mockResolvedValue(null);

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow('Only doctors can create medical records');
    });
  });

  // ---------- findById ----------
  describe('findById', () => {
    it('should return record with relations when found', async () => {
      mockRepo.findOne.mockResolvedValue(mockRecordWithRelations);

      const result = await service.findById('record-uuid-1');

      expect(result).toEqual(mockRecordWithRelations);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'record-uuid-1' },
        relations: ['appointment', 'patient', 'doctor', 'doctor.user'],
      });
    });

    it('should throw NotFoundException when record does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('nonexistent')).rejects.toThrow(
        'Medical record with id nonexistent not found',
      );
    });
  });

  // ---------- findByPatient ----------
  describe('findByPatient', () => {
    it('should return records when patient requests their own', async () => {
      mockRepo.find.mockResolvedValue([mockRecordWithRelations]);

      const result = await service.findByPatient(
        'patient-uuid-1',
        'patient-uuid-1',
        'PATIENT',
      );

      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { patientId: 'patient-uuid-1' },
        }),
      );
    });

    it('should throw ForbiddenException when patient tries to view another patient records', async () => {
      await expect(
        service.findByPatient('other-patient', 'patient-uuid-1', 'PATIENT'),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.findByPatient('other-patient', 'patient-uuid-1', 'PATIENT'),
      ).rejects.toThrow('You can only view your own medical records');
    });

    it('should filter by doctorId when requester is a DOCTOR', async () => {
      mockDoctors.findByUserId.mockResolvedValue(mockDoctor);
      mockRepo.find.mockResolvedValue([mockRecordWithRelations]);

      const result = await service.findByPatient(
        'patient-uuid-1',
        'user-uuid-doctor',
        'DOCTOR',
      );

      expect(mockDoctors.findByUserId).toHaveBeenCalledWith('user-uuid-doctor');
      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            patientId: 'patient-uuid-1',
            doctorId: 'doctor-uuid-1',
          },
        }),
      );
    });

    it('should allow ADMIN to view any patient records without doctor filter', async () => {
      mockRepo.find.mockResolvedValue([mockRecordWithRelations]);

      const result = await service.findByPatient(
        'patient-uuid-1',
        'admin-uuid',
        'ADMIN',
      );

      expect(result).toHaveLength(1);
      // ADMIN does not trigger doctor filtering
      expect(mockDoctors.findByUserId).not.toHaveBeenCalled();
    });

    it('should not add doctorId filter when doctor profile is not found', async () => {
      mockDoctors.findByUserId.mockResolvedValue(null);
      mockRepo.find.mockResolvedValue([]);

      await service.findByPatient(
        'patient-uuid-1',
        'user-without-doctor-profile',
        'DOCTOR',
      );

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { patientId: 'patient-uuid-1' },
        }),
      );
    });
  });

  // ---------- findByAppointment ----------
  describe('findByAppointment', () => {
    it('should return record for the given appointment', async () => {
      mockRepo.findOne.mockResolvedValue(mockRecordWithRelations);

      const result = await service.findByAppointment('appt-uuid-1');

      expect(result).toEqual(mockRecordWithRelations);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { appointmentId: 'appt-uuid-1' },
        relations: ['appointment', 'patient', 'doctor', 'doctor.user'],
      });
    });

    it('should return null when no record exists for the appointment', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.findByAppointment('appt-uuid-99');

      expect(result).toBeNull();
    });
  });

  // ---------- update ----------
  describe('update', () => {
    const updateDto = {
      diagnosis: 'Updated diagnosis',
      treatmentPlan: 'Updated treatment',
    };

    it('should update record when treating doctor requests it', async () => {
      mockRepo.findOne
        .mockResolvedValueOnce(mockRecordWithRelations)  // findById in update
        .mockResolvedValueOnce(mockRecordWithRelations); // findById at the end
      mockDoctors.findByUserId.mockResolvedValue(mockDoctor);

      const result = await service.update(
        'record-uuid-1',
        updateDto,
        'user-uuid-doctor',
      );

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          diagnosis: 'Updated diagnosis',
          treatmentPlan: 'Updated treatment',
        }),
      );
    });

    it('should throw ForbiddenException when non-treating doctor tries to update', async () => {
      const otherDoctor = { ...mockDoctor, id: 'other-doctor-uuid' };
      mockRepo.findOne.mockResolvedValue(mockRecordWithRelations);
      mockDoctors.findByUserId.mockResolvedValue(otherDoctor);

      await expect(
        service.update('record-uuid-1', updateDto, 'other-doctor-user'),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update('record-uuid-1', updateDto, 'other-doctor-user'),
      ).rejects.toThrow('Only the treating doctor can update this medical record');
    });

    it('should throw ForbiddenException when user is not a doctor at all', async () => {
      mockRepo.findOne.mockResolvedValue(mockRecordWithRelations);
      mockDoctors.findByUserId.mockResolvedValue(null);

      await expect(
        service.update('record-uuid-1', updateDto, 'patient-uuid-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', updateDto, 'user-uuid-doctor'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

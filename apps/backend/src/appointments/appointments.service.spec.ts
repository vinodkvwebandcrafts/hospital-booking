import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  AppointmentEntity,
  AppointmentStatus,
  ConsultationType,
} from './entities/appointment.entity';
import { SlotLockingService } from './slot-locking/slot-locking.service';
import { DoctorsService } from '../doctors/doctors.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let mockAppointmentsRepo: any;
  let mockSlotLockingService: any;
  let mockDoctorsService: any;
  let mockEventEmitter: any;

  const mockDoctor = {
    id: 'doctor-uuid-1',
    userId: 'user-uuid-doctor',
    specialization: 'Cardiology',
    appointmentDurationMinutes: 30,
    consultationFee: 200,
    isAvailable: true,
    user: {
      id: 'user-uuid-doctor',
      firstName: 'James',
      lastName: 'Smith',
      email: 'dr.smith@hospital.com',
    },
  };

  const mockAppointment: Partial<AppointmentEntity> = {
    id: 'appointment-uuid-1',
    doctorId: 'doctor-uuid-1',
    patientId: 'patient-uuid-1',
    appointmentDateTime: new Date('2026-03-25T10:00:00.000Z'),
    durationMinutes: 30,
    status: AppointmentStatus.SCHEDULED,
    consultationType: ConsultationType.IN_PERSON,
    consultationFee: 200,
    reminderSent: false,
    doctor: mockDoctor as any,
    patient: {
      id: 'patient-uuid-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    } as any,
  };

  beforeEach(async () => {
    mockAppointmentsRepo = {
      create: jest.fn().mockReturnValue(mockAppointment),
      save: jest.fn().mockResolvedValue(mockAppointment),
      findOne: jest.fn().mockResolvedValue(null),
      findAndCount: jest.fn().mockResolvedValue([[mockAppointment], 1]),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    mockSlotLockingService = {
      acquireSlotLock: jest.fn().mockResolvedValue(true),
      releaseSlotLock: jest.fn().mockResolvedValue(true),
      isSlotLocked: jest.fn().mockResolvedValue(false),
    };

    mockDoctorsService = {
      findById: jest.fn().mockResolvedValue(mockDoctor),
      getAvailableSlots: jest.fn().mockResolvedValue([
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '09:30', endTime: '10:00' },
        { startTime: '10:00', endTime: '10:30' },
      ]),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(AppointmentEntity),
          useValue: mockAppointmentsRepo,
        },
        {
          provide: SlotLockingService,
          useValue: mockSlotLockingService,
        },
        {
          provide: DoctorsService,
          useValue: mockDoctorsService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      doctorId: 'doctor-uuid-1',
      appointmentDateTime: '2026-03-25T10:00:00.000Z',
      reason: 'Checkup',
    };

    it('should create an appointment successfully', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValueOnce(null);
      mockAppointmentsRepo.findOne.mockResolvedValueOnce(mockAppointment);

      const result = await service.create(createDto, 'patient-uuid-1');

      expect(mockSlotLockingService.acquireSlotLock).toHaveBeenCalledWith(
        'doctor-uuid-1',
        expect.any(String),
        'patient-uuid-1',
      );
      expect(mockDoctorsService.findById).toHaveBeenCalledWith('doctor-uuid-1');
      expect(mockAppointmentsRepo.create).toHaveBeenCalled();
      expect(mockAppointmentsRepo.save).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'appointment.created',
        expect.objectContaining({ appointment: expect.any(Object) }),
      );
      expect(result).toBeDefined();
    });

    it('should throw ConflictException when slot lock cannot be acquired', async () => {
      mockSlotLockingService.acquireSlotLock.mockResolvedValue(false);

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when slot is already booked', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValueOnce(mockAppointment);

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(ConflictException);

      expect(mockSlotLockingService.releaseSlotLock).toHaveBeenCalled();
    });

    it('should throw BadRequestException when doctor is not available', async () => {
      mockDoctorsService.findById.mockResolvedValue({
        ...mockDoctor,
        isAvailable: false,
      });

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment successfully', async () => {
      const scheduledAppointment = {
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      };
      mockAppointmentsRepo.findOne.mockResolvedValue(scheduledAppointment);

      const result = await service.cancel(
        'appointment-uuid-1',
        'patient-uuid-1',
      );

      expect(mockAppointmentsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.CANCELLED }),
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'appointment.cancelled',
        expect.any(Object),
      );
    });

    it('should throw BadRequestException when cancelling already cancelled appointment', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      });

      await expect(
        service.cancel('appointment-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when cancelling completed appointment', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.COMPLETED,
      });

      await expect(
        service.cancel('appointment-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots excluding booked and locked ones', async () => {
      mockAppointmentsRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            appointmentDateTime: new Date('2026-03-25T10:00:00.000Z'),
            status: AppointmentStatus.SCHEDULED,
          },
        ]),
      });

      mockSlotLockingService.isSlotLocked
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);

      const result = await service.getAvailableSlots(
        'doctor-uuid-1',
        '2026-03-25',
      );

      expect(result).toHaveLength(3);
      expect(result[2].isAvailable).toBe(false);
      expect(result[0].isAvailable).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue(mockAppointment);

      await service.updateStatus(
        'appointment-uuid-1',
        AppointmentStatus.COMPLETED,
      );

      expect(mockAppointmentsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.COMPLETED }),
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'appointment.completed',
        expect.any(Object),
      );
    });
  });
});

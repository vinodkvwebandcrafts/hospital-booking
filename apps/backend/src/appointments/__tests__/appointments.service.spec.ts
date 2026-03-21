import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsService } from '../appointments.service';
import {
  AppointmentEntity,
  AppointmentStatus,
  ConsultationType,
} from '../entities/appointment.entity';
import { SlotLockingService } from '../slot-locking/slot-locking.service';
import { DoctorsService } from '../../doctors/doctors.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let mockRepo: Record<string, jest.Mock>;
  let mockSlotLocking: Record<string, jest.Mock>;
  let mockDoctors: Record<string, jest.Mock>;
  let mockEmitter: Record<string, jest.Mock>;

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

  const mockPatient = {
    id: 'patient-uuid-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
  };

  const mockAppointment: Partial<AppointmentEntity> = {
    id: 'appt-uuid-1',
    doctorId: 'doctor-uuid-1',
    patientId: 'patient-uuid-1',
    appointmentDateTime: new Date('2026-03-25T10:00:00.000Z'),
    durationMinutes: 30,
    status: AppointmentStatus.SCHEDULED,
    consultationType: ConsultationType.IN_PERSON,
    consultationFee: 200,
    reminderSent: false,
    doctor: mockDoctor as any,
    patient: mockPatient as any,
  };

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockReturnValue(mockAppointment),
      save: jest.fn().mockResolvedValue(mockAppointment),
      findOne: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[mockAppointment], 1]),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    mockSlotLocking = {
      acquireSlotLock: jest.fn().mockResolvedValue(true),
      releaseSlotLock: jest.fn().mockResolvedValue(true),
      isSlotLocked: jest.fn().mockResolvedValue(false),
    };

    mockDoctors = {
      findById: jest.fn().mockResolvedValue(mockDoctor),
      getAvailableSlots: jest.fn().mockResolvedValue([
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '09:30', endTime: '10:00' },
        { startTime: '10:00', endTime: '10:30' },
      ]),
    };

    mockEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(AppointmentEntity), useValue: mockRepo },
        { provide: SlotLockingService, useValue: mockSlotLocking },
        { provide: DoctorsService, useValue: mockDoctors },
        { provide: EventEmitter2, useValue: mockEmitter },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- create ----------
  describe('create', () => {
    const createDto = {
      doctorId: 'doctor-uuid-1',
      appointmentDateTime: '2026-03-25T10:00:00.000Z',
      reason: 'Checkup',
    };

    it('should create an appointment successfully', async () => {
      // First findOne for conflict check = null, second for loading full appointment
      mockRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAppointment);

      const result = await service.create(createDto, 'patient-uuid-1');

      expect(mockDoctors.findById).toHaveBeenCalledWith('doctor-uuid-1');
      expect(mockSlotLocking.acquireSlotLock).toHaveBeenCalledWith(
        'doctor-uuid-1',
        expect.any(String),
        'patient-uuid-1',
      );
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.created',
        expect.objectContaining({ appointment: expect.any(Object) }),
      );
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when doctor is not available', async () => {
      mockDoctors.findById.mockResolvedValue({
        ...mockDoctor,
        isAvailable: false,
      });

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow('Doctor is not currently available');
    });

    it('should throw ConflictException when slot lock cannot be acquired', async () => {
      mockSlotLocking.acquireSlotLock.mockResolvedValue(false);

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow('This time slot is currently being booked');
    });

    it('should throw ConflictException and release lock when slot is already booked', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockAppointment); // existing booking found

      await expect(
        service.create(createDto, 'patient-uuid-1'),
      ).rejects.toThrow(ConflictException);

      expect(mockSlotLocking.releaseSlotLock).toHaveBeenCalledWith(
        'doctor-uuid-1',
        expect.any(String),
        'patient-uuid-1',
      );
    });

    it('should use doctor appointment duration when not specified in dto', async () => {
      mockRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAppointment);

      await service.create(createDto, 'patient-uuid-1');

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          durationMinutes: 30, // from mockDoctor.appointmentDurationMinutes
        }),
      );
    });

    it('should use dto durationMinutes when provided', async () => {
      mockRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAppointment);

      await service.create(
        { ...createDto, durationMinutes: 45 },
        'patient-uuid-1',
      );

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ durationMinutes: 45 }),
      );
    });
  });

  // ---------- findById ----------
  describe('findById', () => {
    it('should return appointment when found', async () => {
      mockRepo.findOne.mockResolvedValue(mockAppointment);

      const result = await service.findById('appt-uuid-1');

      expect(result).toEqual(mockAppointment);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'appt-uuid-1' },
        relations: ['doctor', 'doctor.user', 'patient'],
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------- cancel ----------
  describe('cancel', () => {
    it('should cancel a scheduled appointment by patient', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      });

      const result = await service.cancel('appt-uuid-1', 'patient-uuid-1');

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: AppointmentStatus.CANCELLED,
          cancelledAt: expect.any(Date),
        }),
      );
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.cancelled',
        expect.any(Object),
      );
    });

    it('should allow doctor to cancel their own appointment', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      });

      // doctor.userId matches
      await service.cancel('appt-uuid-1', 'user-uuid-doctor');

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.CANCELLED }),
      );
    });

    it('should throw ForbiddenException when user is not patient or doctor', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      });

      await expect(
        service.cancel('appt-uuid-1', 'stranger-uuid'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when already cancelled', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      });

      await expect(
        service.cancel('appt-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.cancel('appt-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow('Appointment is already cancelled');
    });

    it('should throw BadRequestException when appointment is completed', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockAppointment,
        status: AppointmentStatus.COMPLETED,
      });

      await expect(
        service.cancel('appt-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.cancel('appt-uuid-1', 'patient-uuid-1'),
      ).rejects.toThrow('Cannot cancel a completed appointment');
    });
  });

  // ---------- reschedule ----------
  describe('reschedule', () => {
    it('should cancel old appointment and create a new one', async () => {
      const newDto = {
        doctorId: 'doctor-uuid-1',
        appointmentDateTime: '2026-03-26T14:00:00.000Z',
        reason: 'Rescheduled checkup',
      };

      // cancel path: findOne returns scheduled appointment
      mockRepo.findOne.mockResolvedValueOnce({
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      });
      // create path: conflict check = null, then load full appointment
      mockRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...mockAppointment, id: 'appt-uuid-2' });

      const result = await service.reschedule(
        'appt-uuid-1',
        newDto,
        'patient-uuid-1',
      );

      // cancel was called
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.CANCELLED }),
      );
      // new appointment was created
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.cancelled',
        expect.any(Object),
      );
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.created',
        expect.any(Object),
      );
    });
  });

  // ---------- updateStatus ----------
  describe('updateStatus', () => {
    it('should update to COMPLETED and emit event', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockAppointment });

      await service.updateStatus('appt-uuid-1', AppointmentStatus.COMPLETED);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.COMPLETED }),
      );
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.completed',
        expect.any(Object),
      );
    });

    it('should update to NO_SHOW and emit event', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockAppointment });

      await service.updateStatus('appt-uuid-1', AppointmentStatus.NO_SHOW);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.NO_SHOW }),
      );
      expect(mockEmitter.emit).toHaveBeenCalledWith(
        'appointment.no_show',
        expect.any(Object),
      );
    });

    it('should set cancelledAt when updating to CANCELLED', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockAppointment });

      await service.updateStatus('appt-uuid-1', AppointmentStatus.CANCELLED);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: AppointmentStatus.CANCELLED,
          cancelledAt: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException when appointment does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('nonexistent', AppointmentStatus.COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- getAvailableSlots ----------
  describe('getAvailableSlots', () => {
    it('should return slots with availability status combining DB and Redis', async () => {
      mockRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            appointmentDateTime: new Date('2026-03-25T10:00:00.000Z'),
            status: AppointmentStatus.SCHEDULED,
          },
        ]),
      });

      // Slot at 10:00 is booked, 09:30 is locked in Redis
      mockSlotLocking.isSlotLocked
        .mockResolvedValueOnce(false)  // 09:00
        .mockResolvedValueOnce(true)   // 09:30 locked
        .mockResolvedValueOnce(false); // 10:00

      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-25');

      expect(result).toHaveLength(3);
      // 09:00 - available (not booked, not locked)
      expect(result[0]).toEqual({
        startTime: '09:00',
        endTime: '09:30',
        isAvailable: true,
        isLocked: false,
      });
      // 09:30 - not available (locked in Redis)
      expect(result[1]).toEqual({
        startTime: '09:30',
        endTime: '10:00',
        isAvailable: false,
        isLocked: true,
      });
      // 10:00 - not available (booked in DB)
      expect(result[2]).toEqual({
        startTime: '10:00',
        endTime: '10:30',
        isAvailable: false,
        isLocked: false,
      });
    });

    it('should show all slots available when nothing is booked or locked', async () => {
      mockRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      mockSlotLocking.isSlotLocked.mockResolvedValue(false);

      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-25');

      expect(result.every((s) => s.isAvailable)).toBe(true);
      expect(result.every((s) => !s.isLocked)).toBe(true);
    });
  });

  // ---------- findByPatient ----------
  describe('findByPatient', () => {
    it('should return paginated appointments for a patient', async () => {
      const result = await service.findByPatient('patient-uuid-1', 1, 10);

      expect(result.appointments).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { patientId: 'patient-uuid-1' },
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  // ---------- findByDoctor ----------
  describe('findByDoctor', () => {
    it('should return paginated appointments for a doctor', async () => {
      const result = await service.findByDoctor('doctor-uuid-1', 1, 10);

      expect(result.appointments).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { doctorId: 'doctor-uuid-1' },
        }),
      );
    });
  });

  // ---------- findAll ----------
  describe('findAll', () => {
    it('should return all appointments with default pagination', async () => {
      const result = await service.findAll();

      expect(result.appointments).toHaveLength(1);
      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });

    it('should apply status filter', async () => {
      await service.findAll(1, 10, { status: AppointmentStatus.SCHEDULED });

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: AppointmentStatus.SCHEDULED },
        }),
      );
    });

    it('should apply doctor and patient filters', async () => {
      await service.findAll(1, 10, {
        doctorId: 'doctor-uuid-1',
        patientId: 'patient-uuid-1',
      });

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            doctorId: 'doctor-uuid-1',
            patientId: 'patient-uuid-1',
          },
        }),
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DoctorsService } from '../doctors.service';
import { DoctorEntity } from '../entities/doctor.entity';
import { AvailabilityEntity } from '../entities/availability.entity';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let mockDoctorsRepo: Record<string, jest.Mock>;
  let mockAvailabilityRepo: Record<string, jest.Mock>;

  const mockUser = {
    id: 'user-uuid-doctor',
    firstName: 'James',
    lastName: 'Smith',
    email: 'dr.smith@hospital.com',
    isActive: true,
    city: 'New York',
  };

  const mockDoctor: Partial<DoctorEntity> = {
    id: 'doctor-uuid-1',
    userId: 'user-uuid-doctor',
    user: mockUser as any,
    specialization: 'Cardiology',
    appointmentDurationMinutes: 30,
    consultationFee: 200,
    isAvailable: true,
    averageRating: 4.5,
    totalReviews: 10,
    availabilities: [],
  };

  const mockAvailability: Partial<AvailabilityEntity> = {
    id: 'avail-uuid-1',
    doctorId: 'doctor-uuid-1',
    dayOfWeek: 0, // Monday
    startTime: '09:00',
    endTime: '12:00',
    isActive: true,
  };

  beforeEach(async () => {
    mockDoctorsRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((entity) =>
        Promise.resolve({ ...mockDoctor, ...entity }),
      ),
      find: jest.fn().mockResolvedValue([mockDoctor]),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockAvailabilityRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((entities) =>
        Promise.resolve(Array.isArray(entities) ? entities : [entities]),
      ),
      find: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        { provide: getRepositoryToken(DoctorEntity), useValue: mockDoctorsRepo },
        { provide: getRepositoryToken(AvailabilityEntity), useValue: mockAvailabilityRepo },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- create ----------
  describe('create', () => {
    it('should create and return a doctor', async () => {
      const dto = {
        userId: 'user-uuid-doctor',
        specialization: 'Cardiology',
        appointmentDurationMinutes: 30,
        consultationFee: 200,
      };

      const result = await service.create(dto as any);

      expect(mockDoctorsRepo.create).toHaveBeenCalledWith(dto);
      expect(mockDoctorsRepo.save).toHaveBeenCalled();
      expect(result.specialization).toBe('Cardiology');
    });
  });

  // ---------- findAll ----------
  describe('findAll', () => {
    it('should return all doctors with relations', async () => {
      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockDoctorsRepo.find).toHaveBeenCalledWith({
        relations: ['user', 'availabilities'],
      });
    });
  });

  // ---------- findById ----------
  describe('findById', () => {
    it('should return a doctor when found', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(mockDoctor);

      const result = await service.findById('doctor-uuid-1');

      expect(result).toEqual(mockDoctor);
    });

    it('should throw NotFoundException when doctor is not found', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('nonexistent')).rejects.toThrow(
        'Doctor with id nonexistent not found',
      );
    });
  });

  // ---------- findByUserId ----------
  describe('findByUserId', () => {
    it('should return doctor by user id', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(mockDoctor);

      const result = await service.findByUserId('user-uuid-doctor');

      expect(result).toEqual(mockDoctor);
      expect(mockDoctorsRepo.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-doctor' },
        relations: ['user', 'availabilities'],
      });
    });

    it('should return null when no doctor matches the user id', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      const result = await service.findByUserId('unknown');

      expect(result).toBeNull();
    });
  });

  // ---------- update ----------
  describe('update', () => {
    it('should update and return the doctor', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue({ ...mockDoctor });

      const result = await service.update('doctor-uuid-1', {
        specialization: 'Neurology',
      } as any);

      expect(mockDoctorsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ specialization: 'Neurology' }),
      );
    });

    it('should throw NotFoundException if doctor does not exist', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { specialization: 'X' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- findWithFilters ----------
  describe('findWithFilters', () => {
    let qbMock: Record<string, jest.Mock>;

    beforeEach(() => {
      qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockDoctor], 1]),
      };
      mockDoctorsRepo.createQueryBuilder.mockReturnValue(qbMock);
    });

    it('should return doctors with default pagination', async () => {
      const result = await service.findWithFilters({});

      expect(result.doctors).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(qbMock.skip).toHaveBeenCalledWith(0);
      expect(qbMock.take).toHaveBeenCalledWith(10);
    });

    it('should filter by specialization', async () => {
      await service.findWithFilters({ specialization: 'Cardiology' });

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        'LOWER(doctor.specialization) = LOWER(:specialization)',
        { specialization: 'Cardiology' },
      );
    });

    it('should filter by city', async () => {
      await service.findWithFilters({ city: 'New York' });

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        'LOWER(user.city) = LOWER(:city)',
        { city: 'New York' },
      );
    });

    it('should filter by search term', async () => {
      await service.findWithFilters({ search: 'Smith' });

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(user.firstName) LIKE LOWER(:search)'),
        { search: '%Smith%' },
      );
    });

    it('should apply custom pagination', async () => {
      await service.findWithFilters({ page: 3, limit: 5 });

      expect(qbMock.skip).toHaveBeenCalledWith(10);
      expect(qbMock.take).toHaveBeenCalledWith(5);
    });

    it('should combine multiple filters', async () => {
      await service.findWithFilters({
        specialization: 'Cardiology',
        city: 'New York',
        search: 'Smith',
      });

      // Base where + 3 filter andWhere calls
      expect(qbMock.andWhere).toHaveBeenCalledTimes(4);
    });
  });

  // ---------- setAvailability ----------
  describe('setAvailability', () => {
    it('should delete old availabilities and save new ones', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(mockDoctor);

      const dto = {
        availabilities: [
          { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 2, startTime: '10:00', endTime: '14:00', isActive: true },
        ],
      };

      await service.setAvailability('doctor-uuid-1', dto);

      expect(mockAvailabilityRepo.delete).toHaveBeenCalledWith({
        doctorId: 'doctor-uuid-1',
      });
      expect(mockAvailabilityRepo.create).toHaveBeenCalledTimes(2);
      expect(mockAvailabilityRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ dayOfWeek: 0, doctorId: 'doctor-uuid-1' }),
          expect.objectContaining({ dayOfWeek: 2, doctorId: 'doctor-uuid-1' }),
        ]),
      );
    });

    it('should throw NotFoundException if doctor does not exist', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      await expect(
        service.setAvailability('nonexistent', { availabilities: [] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- getAvailableSlots ----------
  describe('getAvailableSlots', () => {
    it('should generate 30-min slots from availability windows', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue({
        ...mockDoctor,
        appointmentDurationMinutes: 30,
      });
      mockAvailabilityRepo.find.mockResolvedValue([
        { ...mockAvailability, startTime: '09:00', endTime: '11:00' },
      ]);

      // 2026-03-23 is a Monday (dayOfWeek 0 in our system)
      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-23');

      // 09:00-11:00 with 30-min slots = 4 slots
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ startTime: '09:00', endTime: '09:30' });
      expect(result[1]).toEqual({ startTime: '09:30', endTime: '10:00' });
      expect(result[2]).toEqual({ startTime: '10:00', endTime: '10:30' });
      expect(result[3]).toEqual({ startTime: '10:30', endTime: '11:00' });
    });

    it('should return empty array when no availability on that day', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(mockDoctor);
      mockAvailabilityRepo.find.mockResolvedValue([]);

      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-23');

      expect(result).toHaveLength(0);
    });

    it('should handle 15-minute appointment durations', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue({
        ...mockDoctor,
        appointmentDurationMinutes: 15,
      });
      mockAvailabilityRepo.find.mockResolvedValue([
        { ...mockAvailability, startTime: '09:00', endTime: '10:00' },
      ]);

      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-23');

      // 09:00-10:00 with 15-min slots = 4 slots
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ startTime: '09:00', endTime: '09:15' });
      expect(result[3]).toEqual({ startTime: '09:45', endTime: '10:00' });
    });

    it('should not generate a partial slot at the end of the window', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue({
        ...mockDoctor,
        appointmentDurationMinutes: 30,
      });
      mockAvailabilityRepo.find.mockResolvedValue([
        { ...mockAvailability, startTime: '09:00', endTime: '09:45' },
      ]);

      const result = await service.getAvailableSlots('doctor-uuid-1', '2026-03-23');

      // Only one full 30-min slot fits in a 45-min window
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ startTime: '09:00', endTime: '09:30' });
    });

    it('should throw NotFoundException if doctor does not exist', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getAvailableSlots('nonexistent', '2026-03-23'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- remove (soft delete) ----------
  describe('remove', () => {
    it('should set isAvailable to false', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue({ ...mockDoctor });

      await service.remove('doctor-uuid-1');

      expect(mockDoctorsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ isAvailable: false }),
      );
    });

    it('should throw NotFoundException if doctor does not exist', async () => {
      mockDoctorsRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

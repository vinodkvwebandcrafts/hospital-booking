import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { UserEntity, UserRole } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$hashed'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: Record<string, jest.Mock>;

  const mockUser: Partial<UserEntity> = {
    id: 'user-uuid-1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: UserRole.PATIENT,
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ ...mockUser, ...entity })),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- create ----------
  describe('create', () => {
    const createDto = {
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: UserRole.PATIENT,
    };

    it('should create a user with hashed password and return without password', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.create(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          password: '$2b$12$hashed',
        }),
      );
      expect(mockRepo.save).toHaveBeenCalled();
      // password should be deleted from the returned object
      expect(result.password).toBeUndefined();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  // ---------- findAll ----------
  describe('findAll', () => {
    it('should return paginated users', async () => {
      mockRepo.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.findAll(1, 10);

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should apply correct pagination offset for page 2', async () => {
      mockRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(2, 5);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5 }),
      );
    });

    it('should use default values when no arguments are provided', async () => {
      mockRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll();

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });
  });

  // ---------- findById ----------
  describe('findById', () => {
    it('should return a user when found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('user-uuid-1');

      expect(result).toEqual(mockUser);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('nonexistent')).rejects.toThrow(
        'User with id nonexistent not found',
      );
    });
  });

  // ---------- findByEmail ----------
  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should return null when email is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  // ---------- findByEmailWithPassword ----------
  describe('findByEmailWithPassword', () => {
    it('should use queryBuilder to include password field', async () => {
      const getOne = jest.fn().mockResolvedValue({ ...mockUser, password: 'hashed' });
      mockRepo.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne,
      });

      const result = await service.findByEmailWithPassword('john@example.com');

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(result).toBeDefined();
      expect(result!.password).toBe('hashed');
    });
  });

  // ---------- update ----------
  describe('update', () => {
    it('should update and return the user', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockUser });

      const result = await service.update('user-uuid-1', {
        firstName: 'Jane',
      });

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Jane' }),
      );
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException when updating nonexistent user', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { firstName: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- updatePushToken ----------
  describe('updatePushToken', () => {
    it('should update the push token for an existing user', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockUser });

      const result = await service.updatePushToken(
        'user-uuid-1',
        'ExponentPushToken[xxx]',
      );

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ expoPushToken: 'ExponentPushToken[xxx]' }),
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updatePushToken('nonexistent', 'token'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- remove (soft delete) ----------
  describe('remove', () => {
    it('should soft-delete by setting isActive to false', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockUser });

      await service.remove('user-uuid-1');

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

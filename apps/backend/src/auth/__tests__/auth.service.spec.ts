import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/entities/user.entity';

// Mock bcrypt so tests don't do real hashing
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Record<string, jest.Mock>;
  let mockJwtService: Record<string, jest.Mock>;
  let mockConfigService: Record<string, jest.Mock>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'john@example.com',
    password: '$2b$12$hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: UserRole.PATIENT,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const configMap: Record<string, string> = {
          JWT_SECRET: 'test-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          JWT_EXPIRES_IN: '1h',
          JWT_REFRESH_EXPIRES_IN: '7d',
        };
        return configMap[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- register ----------
  describe('register', () => {
    const registerDto = {
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    it('should register a new user and return tokens', async () => {
      const createdUser = { ...mockUser };
      delete (createdUser as any).password;

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      const result = await service.register(registerDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...registerDto,
        role: UserRole.PATIENT,
      });
      expect(result.accessToken).toBe(mockTokens.accessToken);
      expect(result.refreshToken).toBe(mockTokens.refreshToken);
      expect(result.user).toBeDefined();
      // Password must not leak into the response
      expect(result.user.password).toBeUndefined();
    });

    it('should throw ConflictException when email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should always assign PATIENT role regardless of input', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ ...mockUser });
      mockJwtService.signAsync
        .mockResolvedValueOnce('at')
        .mockResolvedValueOnce('rt');

      await service.register(registerDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.PATIENT }),
      );
    });
  });

  // ---------- login ----------
  describe('login', () => {
    const loginDto = { email: 'john@example.com', password: 'password123' };

    it('should login successfully with valid credentials', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe(mockTokens.accessToken);
      expect(result.refreshToken).toBe(mockTokens.refreshToken);
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when account is deactivated', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Account is deactivated',
      );
    });
  });

  // ---------- validateUser ----------
  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('john@example.com', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should throw when user not found', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.validateUser('missing@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when user is inactive', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(
        service.validateUser('john@example.com', 'password123'),
      ).rejects.toThrow('Account is deactivated');
    });

    it('should throw when password does not match', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('john@example.com', 'wrong'),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  // ---------- refreshToken ----------
  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-uuid-1', email: 'john@example.com' });
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-refresh-token', {
        secret: 'test-refresh-secret',
      });
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.refreshToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'deleted-user' });
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-uuid-1' });
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

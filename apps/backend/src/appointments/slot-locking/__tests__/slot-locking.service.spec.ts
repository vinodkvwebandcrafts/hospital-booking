import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SlotLockingService } from '../slot-locking.service';

describe('SlotLockingService', () => {
  let service: SlotLockingService;
  let mockRedis: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockRedis = {
      set: jest.fn(),
      get: jest.fn(),
      exists: jest.fn(),
      eval: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn(),
      status: 'ready',
    };

    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const map: Record<string, any> = {
          REDIS_HOST: 'localhost',
          REDIS_PORT: 6379,
          REDIS_PASSWORD: '',
        };
        return map[key] ?? defaultValue;
      }),
    };

    // We need to mock the Redis constructor before importing the service.
    // Since SlotLockingService creates Redis in its constructor, we mock
    // the ioredis module.
    jest.mock('ioredis', () => {
      return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockRedis),
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotLockingService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SlotLockingService>(SlotLockingService);

    // Override the private redis instance with our mock
    (service as any).redis = mockRedis;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- acquireSlotLock ----------
  describe('acquireSlotLock', () => {
    it('should return true when lock is acquired successfully', async () => {
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.acquireSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(true);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'lock:doctor:doctor-1:slot:2026-03-25T10:00:00.000Z',
        'user-1',
        'EX',
        600,
        'NX',
      );
    });

    it('should return false when slot is already locked by another user', async () => {
      mockRedis.set.mockResolvedValue(null);

      const result = await service.acquireSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-2',
      );

      expect(result).toBe(false);
    });

    it('should use custom TTL when provided', async () => {
      mockRedis.set.mockResolvedValue('OK');

      await service.acquireSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
        300,
      );

      expect(mockRedis.set).toHaveBeenCalledWith(
        expect.any(String),
        'user-1',
        'EX',
        300,
        'NX',
      );
    });

    it('should return true when Redis is not connected (graceful degradation)', async () => {
      mockRedis.status = 'connecting';

      const result = await service.acquireSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(true);
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should return true when Redis throws an error (graceful degradation)', async () => {
      mockRedis.set.mockRejectedValue(new Error('Connection refused'));

      const result = await service.acquireSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(true);
    });
  });

  // ---------- releaseSlotLock ----------
  describe('releaseSlotLock', () => {
    it('should return true when lock is released by the owner', async () => {
      mockRedis.eval.mockResolvedValue(1);

      const result = await service.releaseSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(true);
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.stringContaining('redis.call("get", KEYS[1])'),
        1,
        'lock:doctor:doctor-1:slot:2026-03-25T10:00:00.000Z',
        'user-1',
      );
    });

    it('should return false when lock is owned by a different user', async () => {
      mockRedis.eval.mockResolvedValue(0);

      const result = await service.releaseSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'wrong-user',
      );

      expect(result).toBe(false);
    });

    it('should return true when Redis is not connected', async () => {
      mockRedis.status = 'end';

      const result = await service.releaseSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(true);
      expect(mockRedis.eval).not.toHaveBeenCalled();
    });

    it('should return false when Redis throws an error', async () => {
      mockRedis.eval.mockRejectedValue(new Error('Redis error'));

      const result = await service.releaseSlotLock(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
        'user-1',
      );

      expect(result).toBe(false);
    });
  });

  // ---------- isSlotLocked ----------
  describe('isSlotLocked', () => {
    it('should return true when slot is locked', async () => {
      mockRedis.exists.mockResolvedValue(1);

      const result = await service.isSlotLocked(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBe(true);
    });

    it('should return false when slot is not locked', async () => {
      mockRedis.exists.mockResolvedValue(0);

      const result = await service.isSlotLocked(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBe(false);
    });

    it('should return false when Redis is not connected', async () => {
      mockRedis.status = 'reconnecting';

      const result = await service.isSlotLocked(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBe(false);
      expect(mockRedis.exists).not.toHaveBeenCalled();
    });

    it('should return false when Redis throws an error', async () => {
      mockRedis.exists.mockRejectedValue(new Error('timeout'));

      const result = await service.isSlotLocked(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBe(false);
    });
  });

  // ---------- getSlotLockOwner ----------
  describe('getSlotLockOwner', () => {
    it('should return the user id who holds the lock', async () => {
      mockRedis.get.mockResolvedValue('user-1');

      const result = await service.getSlotLockOwner(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBe('user-1');
    });

    it('should return null when no lock exists', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await service.getSlotLockOwner(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBeNull();
    });

    it('should return null when Redis is not connected', async () => {
      mockRedis.status = 'end';

      const result = await service.getSlotLockOwner(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBeNull();
    });

    it('should return null when Redis throws an error', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.getSlotLockOwner(
        'doctor-1',
        '2026-03-25T10:00:00.000Z',
      );

      expect(result).toBeNull();
    });
  });

  // ---------- key format ----------
  describe('key generation', () => {
    it('should generate correct Redis key format', async () => {
      mockRedis.set.mockResolvedValue('OK');

      await service.acquireSlotLock(
        'doc-abc',
        '2026-12-31T23:59:00.000Z',
        'user-x',
      );

      expect(mockRedis.set).toHaveBeenCalledWith(
        'lock:doctor:doc-abc:slot:2026-12-31T23:59:00.000Z',
        'user-x',
        'EX',
        600,
        'NX',
      );
    });
  });

  // ---------- onModuleDestroy ----------
  describe('onModuleDestroy', () => {
    it('should disconnect Redis on module destroy', () => {
      service.onModuleDestroy();

      expect(mockRedis.disconnect).toHaveBeenCalled();
    });
  });
});

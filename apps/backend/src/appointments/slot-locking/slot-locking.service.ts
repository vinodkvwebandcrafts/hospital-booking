import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class SlotLockingService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(SlotLockingService.name);

  private readonly RELEASE_LOCK_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.warn(
            'Redis connection failed after 3 retries, slot locking will be unavailable',
          );
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed: ${err.message}. Slot locking will operate without Redis.`);
    });
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  private getKey(doctorId: string, dateTime: string): string {
    return `lock:doctor:${doctorId}:slot:${dateTime}`;
  }

  private isConnected(): boolean {
    return this.redis.status === 'ready';
  }

  async acquireSlotLock(
    doctorId: string,
    dateTime: string,
    userId: string,
    ttl = 600,
  ): Promise<boolean> {
    if (!this.isConnected()) {
      this.logger.warn('Redis not connected, skipping slot lock acquisition');
      return true;
    }

    try {
      const key = this.getKey(doctorId, dateTime);
      const result = await this.redis.set(key, userId, 'EX', ttl, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error(`Failed to acquire slot lock: ${error.message}`);
      return true;
    }
  }

  async releaseSlotLock(
    doctorId: string,
    dateTime: string,
    userId: string,
  ): Promise<boolean> {
    if (!this.isConnected()) {
      return true;
    }

    try {
      const key = this.getKey(doctorId, dateTime);
      const result = await this.redis.eval(
        this.RELEASE_LOCK_SCRIPT,
        1,
        key,
        userId,
      );
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to release slot lock: ${error.message}`);
      return false;
    }
  }

  async isSlotLocked(doctorId: string, dateTime: string): Promise<boolean> {
    if (!this.isConnected()) {
      return false;
    }

    try {
      const key = this.getKey(doctorId, dateTime);
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check slot lock: ${error.message}`);
      return false;
    }
  }

  async getSlotLockOwner(
    doctorId: string,
    dateTime: string,
  ): Promise<string | null> {
    if (!this.isConnected()) {
      return null;
    }

    try {
      const key = this.getKey(doctorId, dateTime);
      return this.redis.get(key);
    } catch (error) {
      this.logger.error(`Failed to get slot lock owner: ${error.message}`);
      return null;
    }
  }
}

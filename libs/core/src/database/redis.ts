import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'redis';

export const redisProvider: Provider = {
  provide: REDIS,
  async useFactory() {
    try {
      const redis = new Redis({
        db: +(process.env.REDIS_DB || 0),
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
      });

      await redis.info();

      return redis;
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  },
};

import { Provider } from '@nestjs/common';
import { redisAdapterUrl } from './helper';
import { Emitter } from '@socket.io/redis-emitter';
import { createClient } from 'redis';
import { WS_EMITTER } from '../constants';

export async function newIoEmitter() {
  const redisClient = createClient({ url: redisAdapterUrl });
  await redisClient.connect();

  return new Emitter(redisClient, {
    key: process.env.REDIS_WS_PREFIX,
  });
}

export const wsEmitterProvider: Provider = {
  provide: WS_EMITTER,
  async useFactory() {
    return newIoEmitter();
  },
};

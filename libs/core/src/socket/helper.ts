import 'dotenv/config';

export const redisAdapterUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/1`;

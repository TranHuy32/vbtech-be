import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.forRoot({
      prefix: 'warp-bull',
      redis: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT || 6379),
        db: +(process.env.REDIS_DB || 0),
      },
    }),
  ],
  exports: [BullModule],
})
export class AppBullModule {}

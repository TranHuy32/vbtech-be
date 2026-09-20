import { Module } from '@nestjs/common';
import { CoreServiceModule } from './services/core-service.module';

@Module({
  providers: [CoreServiceModule],
  exports: [CoreServiceModule],
})
export class CoreModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from './core.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [],
  exports: [TypeOrmModule, CoreService],
})
export class CoreServiceModule {}

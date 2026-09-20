import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { makeTypeormOptions } from './helper';

@Injectable()
export class DatabaseOptions implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...makeTypeormOptions(),
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 2,
    };
  }
}

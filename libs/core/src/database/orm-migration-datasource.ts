import { DataSource } from 'typeorm';
import { makeTypeormOptions } from './helper';

export default new DataSource({
  ...makeTypeormOptions(),
  migrations: ['migrations/*{.ts,.js}'],
  entities: [
    'libs/**/*.entity{.ts,.js}',
    'libs/core/src/entities/*.ts',
    'apps/**/*/src/modules/**/*.entity{.ts,.js}',
    'apps/**/*.entity{.ts,.js}',
  ],
});

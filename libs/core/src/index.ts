import BigNumber from 'bignumber.js';
import 'dotenv/config';

export * from './constants';
export * from './core.module';
export * from './database';
export * from './decorators';
export * from './dtos';
export * from './entities';
export * from './exceptions';
export * from './utils';
// load env by default
// env.config();

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

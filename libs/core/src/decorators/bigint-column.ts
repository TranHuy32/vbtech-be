import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';
import { Type } from 'class-transformer';
import { Column, ColumnOptions, ValueTransformer } from 'typeorm';
import { BigNumberTransform } from './bignumber-transform';

export const bigNumberTransformer: ValueTransformer = {
  from(value: string): BigNumber {
    return value ? new BigNumber(value) : null;
  },

  to(value: BigNumber): string {
    return value?.toString();
  },
};

export function NumberColumn(
  type: 'bigint' | 'int' | 'decimal' | 'varchar' = 'decimal',
  opts?: ColumnOptions,
) {
  const colFn = Column({
    type,
    transformer: bigNumberTransformer,
    ...opts,
  });
  const apiFn = opts?.nullable
    ? ApiPropertyOptional({ type: 'string', format: 'number' })
    : ApiProperty({ type: 'string', format: 'number' });

  return function (target: any, key: string) {
    colFn(target, key);
    BigNumberTransform()(target, key);
    apiFn(target, key);
    Type(() => String, {})(target, key);
  };
}

export function PointColumn(opts: ColumnOptions = {}) {
  return NumberColumn('decimal', {
    ...opts,
    scale: 2,
    precision: 15,
  });
}
export function RateColumn(opts: ColumnOptions = {}) {
  return NumberColumn('decimal', {
    scale: 3,
    precision: 10,
    ...opts,
  });
}

export function MoneyColumn(opts: ColumnOptions = {}) {
  return NumberColumn('decimal', {
    scale: 3,
    precision: 15,
    ...opts,
  });
}

export function TradeColumn(opts: ColumnOptions = {}) {
  return NumberColumn('decimal', {
    scale: 8,
    precision: 15,
    ...opts,
    default: 0,
  });
}

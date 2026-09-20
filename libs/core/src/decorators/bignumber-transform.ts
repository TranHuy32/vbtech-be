import { applyDecorators } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { Transform, Type } from 'class-transformer';

export function BigNumberTransform() {
  return applyDecorators(
    Type(() => String),
    Transform(({ value }) => value?.toString(), { toPlainOnly: true }),
    Transform(({ value }) => (value ? new BigNumber(value ?? '0') : null), {
      toClassOnly: true,
    }),
  );
}

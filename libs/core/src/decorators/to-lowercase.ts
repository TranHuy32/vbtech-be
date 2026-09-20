import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';

export function ToLowerCase() {
  return applyDecorators(
    Type(() => String),
    Transform(({ value }) => (value as string)?.toLowerCase()),
  );
}

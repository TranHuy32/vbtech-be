import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { AppValidationError } from '../exceptions';

export const messageForEnum = (value: any) => {
  return `${Object.values(value)}`;
};

function generateErrors(errors: ValidationError[]) {
  const firstError = errors[0];
  const constraintKey = Object.keys(firstError?.constraints || {})?.[0];
  const constraintValue = firstError?.constraints?.[constraintKey];
  const args: any = { property: firstError?.property };

  if (constraintKey === 'isEnum' && !!constraintValue) {
    args.enum = constraintValue;
  }
  if (constraintKey === 'max' && !!constraintValue) {
    args.max = constraintValue;
  }
  if (constraintKey === 'min' && !!constraintValue) {
    args.min = constraintValue;
  }
  if (constraintKey === 'matches' && !!constraintValue) {
    args.pattern = constraintValue;
  }
  return {
    message: constraintValue,
  };
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    const customError = generateErrors(errors);
    return new AppValidationError([customError.message]);
  },
};

export default validationOptions;

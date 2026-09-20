import { Type } from '@nestjs/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export abstract class ApiResponse<T> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: T;

  constructor(data: T, message: string = 'success', status: number = 200) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export function ApiSwaggerFormatedResponse<T>(classReference?: Type<T>) {
  abstract class FormatedResponse {
    @ApiResponseProperty({ example: 200 })
    status: number;

    @ApiResponseProperty({ example: 'success' })
    message: string;

    @ApiResponseProperty({ type: classReference })
    data!: T;
  }
  if (classReference) {
    Object.defineProperty(FormatedResponse, 'name', {
      writable: false,
      value: `${classReference.name}Dto`,
    });
  }

  return FormatedResponse;
}

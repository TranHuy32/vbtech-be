import { ApiResponse } from '../dtos/api-response.abstract';

export class ConcreteApiResponse<T> extends ApiResponse<T> {
  constructor(data: T, message: string = 'success', status: number = 200) {
    super(data, message, status);
  }
}

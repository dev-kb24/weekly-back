import { Expose } from 'class-transformer';

export class ApiResponse<T> {
  @Expose()
  statusCode: number;

  @Expose()
  status: 'success' | 'failed';

  @Expose()
  data: T;

  constructor(statusCode: number, status: 'success' | 'failed', data: T) {
    this.statusCode = statusCode;
    this.status = status;
    this.data = data;
  }
}

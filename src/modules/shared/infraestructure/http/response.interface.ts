import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  data: T;

  meta: MetaApiResponse;
}

export interface ApiErrorResponse {
  statusCode: HttpStatus;

  error:
    | {
        message: string;
        details: any;
      }
    | {
        message: string;
        details: any;
      }[];

  meta: MetaApiResponse;
}

export interface MetaApiResponse {
  [key: string]: any;
  requestId: string;
  timestamp: string;
}

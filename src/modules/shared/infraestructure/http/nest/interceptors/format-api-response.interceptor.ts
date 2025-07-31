import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '../../response.interface';

@Injectable()
export class FormatApiResponse<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data: T): ApiResponse<T> => {
        return {
          data,
          meta: {
            requestId: req.requestId || 'NO_ID',
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../../response.interface';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response<ApiErrorResponse>>();
    const req = ctx.getRequest<Request>();

    console.error(exception);

    const exceptionResponse = exception.getResponse() as { message: string[] };

    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: {
        message: 'Parece que la solicitud no tiene el formato adecuado',
        details: exceptionResponse.message.map((i) => i),
      },
      meta: {
        requestId: req.requestId || 'NO_ID',
        timestamp: new Date().toUTCString(),
      },
    });
  }
}

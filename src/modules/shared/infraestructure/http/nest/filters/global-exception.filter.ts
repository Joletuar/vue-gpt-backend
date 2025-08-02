/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../../response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response<ApiErrorResponse | unknown>>();
    const req = ctx.getRequest<Request>();

    console.error(exception);

    if (exception instanceof NotFoundException) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        error:
          'Pareceq que el recurso al cual estás accediendo no existe, comprueba los datos e intenta de nuevo.',
      });
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        message: 'Hemos tenido problemas para completar la solicitud',
        details:
          'Ocurrió algo inesperado en nuestros servicios, contacta a soporte e intenta mas tarde.',
      },
      meta: {
        requestId: req.requestId || 'NO_ID',
        timestamp: new Date().toUTCString(),
      },
    });
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InfraestructureError } from 'src/modules/shared/domain/errors/infraestructure.error';

import { ApiErrorResponse } from '../../response.interface';

@Catch()
export class GlobalHandlerErrorFilter implements ExceptionFilter {
  catch(_exception: InfraestructureError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response<ApiErrorResponse>>();
    const req = ctx.getRequest<Request>();

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

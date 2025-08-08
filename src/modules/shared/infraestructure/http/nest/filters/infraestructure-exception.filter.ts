import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { OpenAiAssistantServiceUnavailableError } from 'src/modules/assistant/infraestructure/openai/openai-assistant-service-unavailable.error';
import { InfraestructureError } from 'src/modules/shared/domain/errors/infraestructure.error';
import { OpenAiCompletionServiceUnavailableError } from 'src/modules/shared/infraestructure/openai/openai-service-unavailable.error';

import { ApiErrorResponse } from '../../response.interface';

@Catch(InfraestructureError)
export class InfraestructurerExceptionFilter implements ExceptionFilter {
  catch(exception: InfraestructureError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response<ApiErrorResponse>>();
    const req = ctx.getRequest<Request>();

    console.error(exception);

    if (exception.isCritical) {
      // TODO: notify to slack, email or sentry
    }

    if (exception instanceof OpenAiCompletionServiceUnavailableError) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          message: exception.message,
          details:
            'Parece que nuestros servicios de IA no están funcionando correctamente, contacta a soporte e intenta mas tárde.',
        },
        meta: {
          requestId: req.requestId || 'NO_ID',
          timestamp: new Date().toUTCString(),
        },
      });
    }

    if (exception instanceof OpenAiAssistantServiceUnavailableError) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          message: exception.message,
          details:
            'Parece que nuestros servicios de Agentes IA no están funcionando correctamente, contacta a soporte e intenta mas tárde.',
        },
        meta: {
          requestId: req.requestId || 'NO_ID',
          timestamp: new Date().toUTCString(),
        },
      });
    }

    // if (error instanceof ORMError) {}

    // if (error instanceof DatabseError){}

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        message: 'Hemos tenido problemas para completar la solicitud',
        details:
          'Parece que tenemos errores internos, contacta a soporte e intenta mas tarde.',
      },
      meta: {
        requestId: req.requestId || 'NO_ID',
        timestamp: new Date().toUTCString(),
      },
    });
  }
}

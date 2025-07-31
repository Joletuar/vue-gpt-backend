import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Http');

  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV == 'production') return next();

    const { ip, method, baseUrl: url } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} - ${url} - ${statusCode} - ${contentLength} - ${userAgent} - ${ip} - ${req.requestId || 'NO_ID'}`,
      );
    });

    next();
  }
}

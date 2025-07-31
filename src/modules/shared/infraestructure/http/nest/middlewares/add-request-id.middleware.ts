import * as crypto from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AddRequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const requestId = crypto.randomUUID();

    req.requestId = requestId;

    next();
  }
}

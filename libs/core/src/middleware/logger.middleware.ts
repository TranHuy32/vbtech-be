import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`req:`, {
      originalUrl: req.originalUrl,
      headers: req.headers['authorization'],
      body: req.body,
    });
    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}

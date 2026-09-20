import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private static asyncLocalStorage = new AsyncLocalStorage<
    Map<string, string>
  >();

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req.headers['request-id'] || uuidv4();
    req.headers['request-id'] = requestId;
    res.setHeader('request-id', requestId);

    RequestIdMiddleware.asyncLocalStorage.run(
      // @ts-ignore
      new Map([['request-id', requestId]]),
      () => {
        next();
      },
    );
  }

  static getRequestId(): string | undefined {
    const store = RequestIdMiddleware.asyncLocalStorage.getStore();
    return store ? store.get('request-id') : undefined;
  }
}

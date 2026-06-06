import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { type Response } from 'express';

// In case of exception in middleware run before the CORS middleware (eg: JSON Middleware that checks the request body),
// the CORS headers are missing in the response.
// This class add CORS headers to exception response to avoid misleading CORS error.
// Note: CORS origin is restricted to FRONTEND_URL and SERVER_URL for security.
@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  // oxlint-disable-next-line @typescripttypescript/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (!response.header || response.headersSent) {
      return;
    }

    // Restrict CORS origin to allowed URLs (FRONTEND_URL, SERVER_URL) instead of wildcard
    // This prevents CORS bypass security issues while still allowing legitimate requests
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const SERVER_URL = process.env.SERVER_URL;

    // Set CORS headers with restricted origin for exception responses
    if (FRONTEND_URL || SERVER_URL) {
      response.header(
        'Access-Control-Allow-Origin',
        FRONTEND_URL ?? SERVER_URL,
      );
    }

    response.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json(exception.response ?? exception.message);
  }
}

/* @license Enterprise */

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';

import { type Response } from 'express';

import { BillingException } from 'src/engine/core-modules/billing/billing.exception';
import { HttpExceptionHandlerService } from 'src/engine/core-modules/exception-handler/http-exception-handler.service';
import { getBillingExceptionStatusCode } from 'src/engine/core-modules/billing/utils/get-billing-exception-status-code.util';

@Catch(BillingException)
export class BillingRestApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpExceptionHandlerService: HttpExceptionHandlerService,
  ) {}

  catch(exception: BillingException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return this.httpExceptionHandlerService.handleError(
      exception,
      response,
      getBillingExceptionStatusCode(exception),
    );
  }
}

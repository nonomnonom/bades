/* @license Enterprise */

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';
import { type GqlContextType } from '@nestjs/graphql';

import { BillingException } from 'src/engine/core-modules/billing/billing.exception';
import { billingGraphqlApiExceptionHandler } from 'src/engine/core-modules/billing/utils/billing-graphql-api-exception-handler.util';

@Catch(BillingException)
export class BillingGraphqlApiExceptionFilter implements ExceptionFilter {
  catch(exception: BillingException, host: ArgumentsHost) {
    if (host.getType<GqlContextType>() !== 'graphql') {
      throw exception;
    }

    return billingGraphqlApiExceptionHandler(exception);
  }
}

import {
  Catch,
  type ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';

import { msg } from 'src/utils/bades-i18n';
import { AuthenticationError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';

@Catch(ForbiddenException)
export class ForbiddenExceptionGraphqlFilter implements ExceptionFilter {
  catch(exception: ForbiddenException) {
    throw new AuthenticationError(exception.message, {
      userFriendlyMessage: msg`Authentication required.`,
    });
  }
}

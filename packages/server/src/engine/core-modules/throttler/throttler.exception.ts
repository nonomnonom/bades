import { msg } from 'src/utils/bades-i18n';
import type { MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum ThrottlerExceptionCode {
  LIMIT_REACHED = 'LIMIT_REACHED',
}

const getThrottlerExceptionUserFriendlyMessage = (
  code: ThrottlerExceptionCode,
) => {
  switch (code) {
    case ThrottlerExceptionCode.LIMIT_REACHED:
      return msg`Rate limit reached. Please try again later.`;
    default:
      assertUnreachable(code);
  }
};

export class ThrottlerException extends CustomException<ThrottlerExceptionCode> {
  constructor(
    message: string,
    code: ThrottlerExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getThrottlerExceptionUserFriendlyMessage(code),
    });
  }
}

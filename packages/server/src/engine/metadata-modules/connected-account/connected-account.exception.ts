import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum ConnectedAccountExceptionCode {
  CONNECTED_ACCOUNT_NOT_FOUND = 'CONNECTED_ACCOUNT_NOT_FOUND',
  INVALID_CONNECTED_ACCOUNT_INPUT = 'INVALID_CONNECTED_ACCOUNT_INPUT',
  CONNECTED_ACCOUNT_OWNERSHIP_VIOLATION = 'CONNECTED_ACCOUNT_OWNERSHIP_VIOLATION',
}

const getConnectedAccountExceptionUserFriendlyMessage = (
  code: ConnectedAccountExceptionCode,
) => {
  switch (code) {
    case ConnectedAccountExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND:
      return msg`Akun terhubung tidak ditemukan.`;
    case ConnectedAccountExceptionCode.INVALID_CONNECTED_ACCOUNT_INPUT:
      return msg`Input akun terhubung tidak valid.`;
    case ConnectedAccountExceptionCode.CONNECTED_ACCOUNT_OWNERSHIP_VIOLATION:
      return msg`Anda tidak memiliki akses ke akun terhubung ini.`;
    default:
      assertUnreachable(code);
  }
};

export class ConnectedAccountException extends CustomException<ConnectedAccountExceptionCode> {
  constructor(
    message: string,
    code: ConnectedAccountExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getConnectedAccountExceptionUserFriendlyMessage(code),
    });
  }
}

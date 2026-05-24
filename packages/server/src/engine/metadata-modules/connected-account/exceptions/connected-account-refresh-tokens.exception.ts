import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum ConnectedAccountRefreshAccessTokenExceptionCode {
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  PROVIDER_NOT_SUPPORTED = 'PROVIDER_NOT_SUPPORTED',
  TEMPORARY_NETWORK_ERROR = 'TEMPORARY_NETWORK_ERROR',
  ACCESS_TOKEN_NOT_FOUND = 'ACCESS_TOKEN_NOT_FOUND',
}

const getConnectedAccountRefreshAccessTokenExceptionUserFriendlyMessage = (
  code: ConnectedAccountRefreshAccessTokenExceptionCode,
) => {
  switch (code) {
    case ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND:
      return msg`Token refresh tidak ditemukan.`;
    case ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN:
      return msg`Token refresh tidak valid.`;
    case ConnectedAccountRefreshAccessTokenExceptionCode.PROVIDER_NOT_SUPPORTED:
      return msg`Provider ini tidak didukung.`;
    case ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR:
      return msg`Terjadi kesalahan jaringan sementara.`;
    case ConnectedAccountRefreshAccessTokenExceptionCode.ACCESS_TOKEN_NOT_FOUND:
      return msg`Access token tidak ditemukan.`;
    default:
      assertUnreachable(code);
  }
};

export class ConnectedAccountRefreshAccessTokenException extends CustomException<ConnectedAccountRefreshAccessTokenExceptionCode> {
  constructor(
    message: string,
    code: ConnectedAccountRefreshAccessTokenExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getConnectedAccountRefreshAccessTokenExceptionUserFriendlyMessage(code),
    });
  }
}

import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WebhookExceptionCode {
  WEBHOOK_NOT_FOUND = 'WEBHOOK_NOT_FOUND',
  WEBHOOK_ALREADY_EXISTS = 'WEBHOOK_ALREADY_EXISTS',
  INVALID_WEBHOOK_INPUT = 'INVALID_WEBHOOK_INPUT',
  INVALID_TARGET_URL = 'INVALID_TARGET_URL',
}

const getWebhookExceptionUserFriendlyMessage = (code: WebhookExceptionCode) => {
  switch (code) {
    case WebhookExceptionCode.WEBHOOK_NOT_FOUND:
      return msg`Webhook tidak ditemukan.`;
    case WebhookExceptionCode.WEBHOOK_ALREADY_EXISTS:
      return msg`Webhook dengan konfigurasi ini sudah ada.`;
    case WebhookExceptionCode.INVALID_WEBHOOK_INPUT:
      return msg`Input webhook tidak valid.`;
    case WebhookExceptionCode.INVALID_TARGET_URL:
      return msg`URL target tidak valid. Harap berikan URL HTTP atau HTTPS yang valid.`;
    default:
      assertUnreachable(code);
  }
};

export class WebhookException extends CustomException<WebhookExceptionCode> {
  constructor(
    message: string,
    code: WebhookExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getWebhookExceptionUserFriendlyMessage(code),
    });
  }
}

import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum EventStreamExceptionCode {
  EVENT_STREAM_ALREADY_EXISTS = 'EVENT_STREAM_ALREADY_EXISTS',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
}

const getEventStreamExceptionUserFriendlyMessage = (
  code: EventStreamExceptionCode,
) => {
  switch (code) {
    case EventStreamExceptionCode.EVENT_STREAM_ALREADY_EXISTS:
      return msg`Gagal menerima pembaruan real-time.`;
    case EventStreamExceptionCode.NOT_AUTHORIZED:
      return msg`Anda tidak memiliki izin untuk melakukan tindakan ini.`;
    default:
      assertUnreachable(code);
  }
};

export class EventStreamException extends CustomException<EventStreamExceptionCode> {
  constructor(
    message: string,
    code: EventStreamExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getEventStreamExceptionUserFriendlyMessage(code),
    });
  }
}

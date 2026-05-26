import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum CalendarEventImportExceptionCode {
  PROVIDER_NOT_SUPPORTED = 'PROVIDER_NOT_SUPPORTED',
  UNKNOWN = 'UNKNOWN',
}

const getCalendarEventImportExceptionUserFriendlyMessage = (
  code: CalendarEventImportExceptionCode,
) => {
  switch (code) {
    case CalendarEventImportExceptionCode.PROVIDER_NOT_SUPPORTED:
      return msg`Penyedia kalender tidak didukung.`;
    case CalendarEventImportExceptionCode.UNKNOWN:
      return msg`Terjadi kesalahan kalender yang tidak diketahui.`;
    default:
      assertUnreachable(code);
  }
};

export class CalendarEventImportException extends CustomException<CalendarEventImportExceptionCode> {
  constructor(
    message: string,
    code: CalendarEventImportExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getCalendarEventImportExceptionUserFriendlyMessage(code),
    });
  }
}

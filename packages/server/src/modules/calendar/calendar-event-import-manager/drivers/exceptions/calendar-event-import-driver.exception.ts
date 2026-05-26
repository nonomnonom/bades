import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum CalendarEventImportDriverExceptionCode {
  NOT_FOUND = 'NOT_FOUND',
  TEMPORARY_ERROR = 'TEMPORARY_ERROR',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  SYNC_CURSOR_ERROR = 'SYNC_CURSOR_ERROR',
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_NETWORK_ERROR = 'UNKNOWN_NETWORK_ERROR',
  HANDLE_ALIASES_REQUIRED = 'HANDLE_ALIASES_REQUIRED',
  CHANNEL_MISCONFIGURED = 'CHANNEL_MISCONFIGURED',
}

const getCalendarEventImportDriverExceptionUserFriendlyMessage = (
  code: CalendarEventImportDriverExceptionCode,
) => {
  switch (code) {
    case CalendarEventImportDriverExceptionCode.NOT_FOUND:
      return msg`Peristiwa kalender tidak ditemukan.`;
    case CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR:
      return msg`Terjadi kesalahan sementara. Silakan coba lagi.`;
    case CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS:
      return msg`Izin tidak cukup untuk mengakses kalender.`;
    case CalendarEventImportDriverExceptionCode.SYNC_CURSOR_ERROR:
      return msg`Kesalahan sinkronisasi kalender.`;
    case CalendarEventImportDriverExceptionCode.UNKNOWN:
      return msg`Terjadi kesalahan kalender yang tidak diketahui.`;
    case CalendarEventImportDriverExceptionCode.UNKNOWN_NETWORK_ERROR:
      return msg`Terjadi kesalahan jaringan saat mengakses kalender.`;
    case CalendarEventImportDriverExceptionCode.HANDLE_ALIASES_REQUIRED:
      return msg`Alias handle diperlukan.`;
    case CalendarEventImportDriverExceptionCode.CHANNEL_MISCONFIGURED:
      return msg`Saluran kalender tidak dikonfigurasi dengan benar.`;
    default:
      assertUnreachable(code);
  }
};

export class CalendarEventImportDriverException extends CustomException<CalendarEventImportDriverExceptionCode> {
  constructor(
    message: string,
    code: CalendarEventImportDriverExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getCalendarEventImportDriverExceptionUserFriendlyMessage(code),
    });
  }
}

import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum DashboardExceptionCode {
  DASHBOARD_NOT_FOUND = 'DASHBOARD_NOT_FOUND',
  DASHBOARD_DUPLICATION_FAILED = 'DASHBOARD_DUPLICATION_FAILED',
  PAGE_LAYOUT_NOT_FOUND = 'PAGE_LAYOUT_NOT_FOUND',
}

export enum DashboardExceptionMessageKey {
  DASHBOARD_NOT_FOUND = 'DASHBOARD_NOT_FOUND',
  DASHBOARD_DUPLICATION_FAILED = 'DASHBOARD_DUPLICATION_FAILED',
  PAGE_LAYOUT_NOT_FOUND = 'PAGE_LAYOUT_NOT_FOUND',
}

const getDashboardExceptionUserFriendlyMessage = (
  code: DashboardExceptionCode,
) => {
  switch (code) {
    case DashboardExceptionCode.DASHBOARD_NOT_FOUND:
      return msg`Dashboard tidak ditemukan.`;
    case DashboardExceptionCode.DASHBOARD_DUPLICATION_FAILED:
      return msg`Gagal menggandakan dashboard.`;
    case DashboardExceptionCode.PAGE_LAYOUT_NOT_FOUND:
      return msg`Tata letak halaman tidak ditemukan.`;
    default:
      assertUnreachable(code);
  }
};

export class DashboardException extends CustomException<DashboardExceptionCode> {
  constructor(
    message: string,
    code: DashboardExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getDashboardExceptionUserFriendlyMessage(code),
    });
  }
}

export const generateDashboardExceptionMessage = (
  key: DashboardExceptionMessageKey,
  value?: string,
): string => {
  switch (key) {
    case DashboardExceptionMessageKey.DASHBOARD_NOT_FOUND:
      return `Dashboard dengan ID "${value}" tidak ditemukan`;
    case DashboardExceptionMessageKey.DASHBOARD_DUPLICATION_FAILED:
      return `Gagal menggandakan dashboard: ${value}`;
    case DashboardExceptionMessageKey.PAGE_LAYOUT_NOT_FOUND:
      return `Tata letak halaman untuk dashboard "${value}" tidak ditemukan`;
    default:
      assertUnreachable(key);
  }
};

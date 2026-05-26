import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum ChartDataExceptionCode {
  WIDGET_NOT_FOUND = 'WIDGET_NOT_FOUND',
  INVALID_WIDGET_CONFIGURATION = 'INVALID_WIDGET_CONFIGURATION',
  OBJECT_METADATA_NOT_FOUND = 'OBJECT_METADATA_NOT_FOUND',
  FIELD_METADATA_NOT_FOUND = 'FIELD_METADATA_NOT_FOUND',
  QUERY_EXECUTION_FAILED = 'QUERY_EXECUTION_FAILED',
  TRANSFORMATION_FAILED = 'TRANSFORMATION_FAILED',
}

const getChartDataExceptionUserFriendlyMessage = (
  code: ChartDataExceptionCode,
): MessageDescriptor => {
  switch (code) {
    case ChartDataExceptionCode.WIDGET_NOT_FOUND:
      return msg`Widget tidak ditemukan.`;
    case ChartDataExceptionCode.INVALID_WIDGET_CONFIGURATION:
      return msg`Konfigurasi widget tidak valid.`;
    case ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND:
      return msg`Metadata objek tidak ditemukan.`;
    case ChartDataExceptionCode.FIELD_METADATA_NOT_FOUND:
      return msg`Metadata kolom tidak ditemukan.`;
    case ChartDataExceptionCode.QUERY_EXECUTION_FAILED:
      return msg`Eksekusi kueri gagal.`;
    case ChartDataExceptionCode.TRANSFORMATION_FAILED:
      return msg`Transformasi gagal.`;
    default:
      assertUnreachable(code);
  }
};

export class ChartDataException extends CustomException<ChartDataExceptionCode> {
  constructor(
    message: string,
    code: ChartDataExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getChartDataExceptionUserFriendlyMessage(code),
    });
  }
}

export const generateChartDataExceptionMessage = (
  code: ChartDataExceptionCode,
  context?: string,
): string => {
  const messages: Record<ChartDataExceptionCode, string> = {
    [ChartDataExceptionCode.WIDGET_NOT_FOUND]: `Widget tidak ditemukan${context ? `: ${context}` : ''}`,
    [ChartDataExceptionCode.INVALID_WIDGET_CONFIGURATION]: `Konfigurasi widget tidak valid${context ? `: ${context}` : ''}`,
    [ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND]: `Metadata objek tidak ditemukan${context ? `: ${context}` : ''}`,
    [ChartDataExceptionCode.FIELD_METADATA_NOT_FOUND]: `Metadata kolom tidak ditemukan${context ? `: ${context}` : ''}`,
    [ChartDataExceptionCode.QUERY_EXECUTION_FAILED]: `Eksekusi kueri gagal${context ? `: ${context}` : ''}`,
    [ChartDataExceptionCode.TRANSFORMATION_FAILED]: `Transformasi gagal${context ? `: ${context}` : ''}`,
  };

  return messages[code];
};

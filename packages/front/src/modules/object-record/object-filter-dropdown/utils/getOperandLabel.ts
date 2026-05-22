import { t } from '~/utils/i18n/badesI18n';
import { isNonEmptyString } from '@sniptt/guards';
import { ViewFilterOperand } from 'shared/types';

export const getOperandLabel = (
  operand: ViewFilterOperand | null | undefined,
  timeZoneAbbreviation?: string | null | undefined,
) => {
  const shouldDisplayTimeZoneAbbreviation =
    isNonEmptyString(timeZoneAbbreviation);

  const timeZoneAbbreviationSuffix = shouldDisplayTimeZoneAbbreviation
    ? ` (${timeZoneAbbreviation})`
    : '';

  switch (operand) {
    case ViewFilterOperand.CONTAINS:
      return t`Berisi`;
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return t`Tidak berisi`;
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return t`Lebih besar atau sama dengan`;
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return t`Lebih kecil atau sama dengan`;
    case ViewFilterOperand.IS_BEFORE:
      return t`Sebelum`;
    case ViewFilterOperand.IS_AFTER:
      return t`Setelah atau sama dengan`;
    case ViewFilterOperand.IS:
      return t`Sama dengan`;
    case ViewFilterOperand.IS_NOT:
      return t`Tidak sama dengan`;
    case ViewFilterOperand.IS_NOT_NULL:
      return t`Terisi`;
    case ViewFilterOperand.IS_EMPTY:
      return t`Kosong`;
    case ViewFilterOperand.IS_NOT_EMPTY:
      return t`Tidak kosong`;
    case ViewFilterOperand.IS_RELATIVE:
      return t`Relatif`;
    case ViewFilterOperand.IS_IN_PAST:
      return t`Di masa lalu`;
    case ViewFilterOperand.IS_IN_FUTURE:
      return t`Di masa depan`;
    case ViewFilterOperand.IS_TODAY:
      return t`Hari ini${timeZoneAbbreviationSuffix}`;
    default:
      return '';
  }
};

export const getOperandLabelShort = (
  operand: ViewFilterOperand | null | undefined,
  timeZoneAbbreviation?: string | null | undefined,
) => {
  const shouldDisplayTimeZoneAbbreviation =
    isNonEmptyString(timeZoneAbbreviation);

  const timeZoneAbbreviationSuffix = shouldDisplayTimeZoneAbbreviation
    ? ` (${timeZoneAbbreviation})`
    : '';

  switch (operand) {
    case ViewFilterOperand.IS:
    case ViewFilterOperand.CONTAINS:
      return ': ';
    case ViewFilterOperand.IS_NOT:
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return t`: Bukan`;
    case ViewFilterOperand.IS_NOT_NULL:
      return t`: Terisi`;
    case ViewFilterOperand.IS_NOT_EMPTY:
      return t`: TidakKosong`;
    case ViewFilterOperand.IS_EMPTY:
      return t`: Kosong`;
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return '\u00A0≥ ';
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return '\u00A0≤ ';
    case ViewFilterOperand.IS_BEFORE:
      return '\u00A0< ';
    case ViewFilterOperand.IS_AFTER:
      return '\u00A0≥ ';
    case ViewFilterOperand.IS_IN_PAST:
      return t`: Lalu`;
    case ViewFilterOperand.IS_IN_FUTURE:
      return t`: Depan`;
    case ViewFilterOperand.IS_TODAY:
      return t`: HariIni${timeZoneAbbreviationSuffix}`;
    default:
      return ': ';
  }
};

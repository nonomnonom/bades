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
      return `Berisi`;
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return `Tidak berisi`;
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return `Lebih besar atau sama dengan`;
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return `Lebih kecil atau sama dengan`;
    case ViewFilterOperand.IS_BEFORE:
      return `Sebelum`;
    case ViewFilterOperand.IS_AFTER:
      return `Setelah atau sama dengan`;
    case ViewFilterOperand.IS:
      return `Sama dengan`;
    case ViewFilterOperand.IS_NOT:
      return `Tidak sama dengan`;
    case ViewFilterOperand.IS_NOT_NULL:
      return `Terisi`;
    case ViewFilterOperand.IS_EMPTY:
      return `Kosong`;
    case ViewFilterOperand.IS_NOT_EMPTY:
      return `Tidak kosong`;
    case ViewFilterOperand.IS_RELATIVE:
      return `Relatif`;
    case ViewFilterOperand.IS_IN_PAST:
      return `Di masa lalu`;
    case ViewFilterOperand.IS_IN_FUTURE:
      return `Di masa depan`;
    case ViewFilterOperand.IS_TODAY:
      return `Hari ini${timeZoneAbbreviationSuffix}`;
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
      return `: Bukan`;
    case ViewFilterOperand.IS_NOT_NULL:
      return `: Terisi`;
    case ViewFilterOperand.IS_NOT_EMPTY:
      return `: TidakKosong`;
    case ViewFilterOperand.IS_EMPTY:
      return `: Kosong`;
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return '\u00A0≥ ';
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return '\u00A0≤ ';
    case ViewFilterOperand.IS_BEFORE:
      return '\u00A0< ';
    case ViewFilterOperand.IS_AFTER:
      return '\u00A0≥ ';
    case ViewFilterOperand.IS_IN_PAST:
      return `: Lalu`;
    case ViewFilterOperand.IS_IN_FUTURE:
      return `: Depan`;
    case ViewFilterOperand.IS_TODAY:
      return `: HariIni${timeZoneAbbreviationSuffix}`;
    default:
      return ': ';
  }
};

import { t } from '@lingui/core/macro';
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
      return ""Contains";
    case ViewFilterOperand.DOES_NOT_CONTAIN:
      return ""Doesn't contain";
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return ""Greater than or equal";
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return ""Less than or equal";
    case ViewFilterOperand.IS_BEFORE:
      return ""Is before";
    case ViewFilterOperand.IS_AFTER:
      return ""Is after or equal";
    case ViewFilterOperand.IS:
      return "Adalah";
    case ViewFilterOperand.IS_NOT:
      return "Bukan";
    case ViewFilterOperand.IS_NOT_NULL:
      return ""Is not null";
    case ViewFilterOperand.IS_EMPTY:
      return ""Is empty";
    case ViewFilterOperand.IS_NOT_EMPTY:
      return ""Is not empty";
    case ViewFilterOperand.IS_RELATIVE:
      return ""Is relative";
    case ViewFilterOperand.IS_IN_PAST:
      return ""Is in past";
    case ViewFilterOperand.IS_IN_FUTURE:
      return ""Is in future";
    case ViewFilterOperand.IS_TODAY:
      return t`Is today${timeZoneAbbreviationSuffix}`;
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
      return ": Bukan";
    case ViewFilterOperand.IS_NOT_NULL:
      return ": Tidak Null";
    case ViewFilterOperand.IS_NOT_EMPTY:
      return ": Tidak Kosong";
    case ViewFilterOperand.IS_EMPTY:
      return ": Kosong";
    case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
      return '\u00A0≥ ';
    case ViewFilterOperand.LESS_THAN_OR_EQUAL:
      return '\u00A0≤ ';
    case ViewFilterOperand.IS_BEFORE:
      return '\u00A0< ';
    case ViewFilterOperand.IS_AFTER:
      return '\u00A0≥ ';
    case ViewFilterOperand.IS_IN_PAST:
      return ": Lampau";
    case ViewFilterOperand.IS_IN_FUTURE:
      return ": Akan Datang";
    case ViewFilterOperand.IS_TODAY:
      return t`: Today${timeZoneAbbreviationSuffix}`;
    default:
      return ': ';
  }
};

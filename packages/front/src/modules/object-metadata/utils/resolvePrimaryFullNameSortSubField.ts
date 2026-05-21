import { ALLOWED_FULL_NAME_SORT_SUBFIELDS } from 'shared/constants';
import { type AllowedFullNameSortSubField } from 'shared/types';
import { isDefined } from 'shared/utils';

const DEFAULT_PRIMARY_SUB_FIELD: AllowedFullNameSortSubField = 'firstName';

const isAllowedFullNameSortSubField = (
  value: string | null | undefined,
): value is AllowedFullNameSortSubField =>
  ALLOWED_FULL_NAME_SORT_SUBFIELDS.includes(
    value as AllowedFullNameSortSubField,
  );

export const resolvePrimaryFullNameSortSubField = ({
  requestedPrimarySubField,
}: {
  requestedPrimarySubField?: string | null;
} = {}): AllowedFullNameSortSubField => {
  if (
    isDefined(requestedPrimarySubField) &&
    isAllowedFullNameSortSubField(requestedPrimarySubField)
  ) {
    return requestedPrimarySubField;
  }
  return DEFAULT_PRIMARY_SUB_FIELD;
};

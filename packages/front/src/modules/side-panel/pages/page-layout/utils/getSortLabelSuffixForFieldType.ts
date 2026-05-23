import { t } from '~/utils/i18n/badesI18n';
import { FieldMetadataType } from 'shared/types';
import {
  isDefined,
  isFieldMetadataNumericKind,
  isFieldMetadataTextKind,
} from 'shared/utils';

import { GraphOrderBy } from '~/generated-metadata/graphql';

export const getSortLabelSuffixForFieldType = ({
  fieldType,
  orderBy,
}: {
  fieldType: FieldMetadataType | undefined;
  orderBy: GraphOrderBy;
}): string => {
  const isAscending =
    orderBy === GraphOrderBy.FIELD_ASC ||
    orderBy === GraphOrderBy.FIELD_POSITION_ASC ||
    orderBy === GraphOrderBy.VALUE_ASC;

  if (!isDefined(fieldType)) {
    return isAscending ? "ascending" : "descending";
  }

  if (isFieldMetadataTextKind(fieldType)) {
    return isAscending ? "alphabetical" : "reverse alphabetical";
  }

  if (isFieldMetadataNumericKind(fieldType)) {
    return isAscending ? "ascending" : "descending";
  }

  if (fieldType === FieldMetadataType.SELECT) {
    if (
      orderBy === GraphOrderBy.FIELD_ASC ||
      orderBy === GraphOrderBy.FIELD_DESC
    ) {
      return isAscending ? "alphabetical" : "reverse alphabetical";
    }

    if (
      orderBy === GraphOrderBy.FIELD_POSITION_ASC ||
      orderBy === GraphOrderBy.FIELD_POSITION_DESC
    ) {
      return isAscending ? "position ascending" : "position descending";
    }

    return isAscending ? "ascending" : "descending";
  }

  return isAscending ? "ascending" : "descending";
};

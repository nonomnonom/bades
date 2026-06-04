import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { isHiddenSystemField } from '@/object-metadata/utils/isHiddenSystemField';
import { isFieldRelation } from '@/object-record/record-field/ui/types/guards/isFieldRelation';
import { RelationType } from '~/generated-metadata/graphql';

const isActiveField = (field: FieldMetadataItem) => field.isActive !== false;

export const isGraphWidgetAggregateField = (field: FieldMetadataItem) =>
  isActiveField(field) &&
  !isFieldRelation(field) &&
  !isHiddenSystemField(field);

export const isGraphWidgetGroupByField = (field: FieldMetadataItem) => {
  if (!isActiveField(field) || isHiddenSystemField(field)) {
    return false;
  }

  if (isFieldRelation(field)) {
    return field.relation?.type === RelationType.MANY_TO_ONE;
  }

  return true;
};

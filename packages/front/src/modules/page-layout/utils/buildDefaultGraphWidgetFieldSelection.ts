import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { isHiddenSystemField } from '@/object-metadata/utils/isHiddenSystemField';
import { isFieldRelation } from '@/object-record/record-field/ui/types/guards/isFieldRelation';
import { type GraphWidgetFieldSelection } from '@/page-layout/types/GraphWidgetFieldSelection';
import { FieldMetadataType, RelationType } from '~/generated-metadata/graphql';

const isActiveField = (field: FieldMetadataItem) => field.isActive !== false;

const isAggregateChartField = (field: FieldMetadataItem) =>
  isActiveField(field) &&
  !isFieldRelation(field) &&
  !isHiddenSystemField(field);

const isGroupByChartField = (field: FieldMetadataItem) => {
  if (!isActiveField(field) || isHiddenSystemField(field)) {
    return false;
  }

  if (isFieldRelation(field)) {
    return field.relation?.type === RelationType.MANY_TO_ONE;
  }

  return true;
};

export const buildDefaultGraphWidgetFieldSelection = (
  objectMetadataItem: EnrichedObjectMetadataItem,
): GraphWidgetFieldSelection => {
  const fields = objectMetadataItem.fields ?? [];

  const aggregateField =
    fields.find(
      (field) =>
        isAggregateChartField(field) && field.type === FieldMetadataType.NUMBER,
    ) ?? fields.find(isAggregateChartField);

  const groupByField =
    fields.find(
      (field) =>
        isGroupByChartField(field) &&
        (field.type === FieldMetadataType.SELECT ||
          field.type === FieldMetadataType.MULTI_SELECT),
    ) ?? fields.find(isGroupByChartField);

  return {
    objectMetadataId: objectMetadataItem.id,
    aggregateFieldMetadataId: aggregateField?.id,
    groupByFieldMetadataIdX: groupByField?.id,
  };
};

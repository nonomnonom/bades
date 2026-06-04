import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type GraphWidgetFieldSelection } from '@/page-layout/types/GraphWidgetFieldSelection';
import {
  isGraphWidgetAggregateField,
  isGraphWidgetGroupByField,
} from '@/page-layout/widgets/graph/utils/graphWidgetChartFieldFilters';
import { FieldMetadataType } from '~/generated-metadata/graphql';

export const buildDefaultGraphWidgetFieldSelection = (
  objectMetadataItem: EnrichedObjectMetadataItem,
): GraphWidgetFieldSelection => {
  const fields = objectMetadataItem.fields ?? [];

  const aggregateField =
    fields.find(
      (field) =>
        isGraphWidgetAggregateField(field) &&
        field.type === FieldMetadataType.NUMBER,
    ) ?? fields.find(isGraphWidgetAggregateField);

  const groupByField =
    fields.find(
      (field) =>
        isGraphWidgetGroupByField(field) &&
        (field.type === FieldMetadataType.SELECT ||
          field.type === FieldMetadataType.MULTI_SELECT),
    ) ?? fields.find(isGraphWidgetGroupByField);

  return {
    objectMetadataId: objectMetadataItem.id,
    aggregateFieldMetadataId: aggregateField?.id,
    groupByFieldMetadataIdX: groupByField?.id,
  };
};

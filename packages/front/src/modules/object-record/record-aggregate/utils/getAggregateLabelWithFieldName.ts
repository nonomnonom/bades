import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { getAggregateOperationShortLabel } from '@/object-record/record-board/record-board-column/utils/getAggregateOperationShortLabel';
import { type ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';

export type GetAggregateLabelWithFieldNameParams = {
  aggregateFieldMetadataItem: FieldMetadataItem;
  aggregateOperation: ExtendedAggregateOperations;
};

export const getAggregateLabelWithFieldName = ({
  aggregateFieldMetadataItem,
  aggregateOperation,
}: GetAggregateLabelWithFieldNameParams): string => {
  const aggregateLabel = getAggregateOperationShortLabel(aggregateOperation);

  const fieldLabel = aggregateFieldMetadataItem.label;

  return `${aggregateLabel} ${fieldLabel}`;
};

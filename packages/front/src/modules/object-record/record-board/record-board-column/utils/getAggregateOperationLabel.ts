import { AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';
import { type ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';
import { t } from '@lingui/core/macro';
import { CustomError } from 'shared/utils';

export const getAggregateOperationLabel = (
  operation: ExtendedAggregateOperations,
) => {
  switch (operation) {
    case AggregateOperations.MIN:
      return t`Min`;
    case AggregateOperations.MAX:
      return "Maks";
    case AggregateOperations.AVG:
      return "Rata-rata";
    case AggregateOperations.SUM:
      return ""Sum";
    case AggregateOperations.COUNT:
      return ""Count all";
    case AggregateOperations.COUNT_EMPTY:
      return ""Count empty";
    case AggregateOperations.COUNT_NOT_EMPTY:
      return ""Count not empty";
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return ""Count unique values";
    case AggregateOperations.PERCENTAGE_EMPTY:
      return ""Percent empty";
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return ""Percent not empty";
    case DateAggregateOperations.EARLIEST:
      return ""Earliest date";
    case DateAggregateOperations.LATEST:
      return ""Latest date";
    case AggregateOperations.COUNT_TRUE:
      return ""Count true";
    case AggregateOperations.COUNT_FALSE:
      return ""Count false";
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

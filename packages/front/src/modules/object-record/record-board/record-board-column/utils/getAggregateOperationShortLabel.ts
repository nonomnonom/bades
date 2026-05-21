import { AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';
import { type ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';
import { msg } from '@lingui/core/macro';
import { CustomError } from 'shared/utils';

export const getAggregateOperationShortLabel = (
  operation: ExtendedAggregateOperations,
) => {
  switch (operation) {
    case AggregateOperations.MIN:
      return msg`Min`;
    case AggregateOperations.MAX:
      return "Maks";
    case AggregateOperations.AVG:
      return "Rata-rata";
    case AggregateOperations.SUM:
      return ""Sum";
    case AggregateOperations.COUNT:
      return "Semua";
    case AggregateOperations.COUNT_EMPTY:
    case AggregateOperations.PERCENTAGE_EMPTY:
      return ""Empty";
    case AggregateOperations.COUNT_NOT_EMPTY:
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return ""Not empty";
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return "Unik";
    case DateAggregateOperations.EARLIEST:
      return ""Earliest";
    case DateAggregateOperations.LATEST:
      return ""Latest";
    case AggregateOperations.COUNT_TRUE:
      return "Benar";
    case AggregateOperations.COUNT_FALSE:
      return "Salah";
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

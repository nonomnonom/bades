import { AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';
import { type ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';
import { CustomError } from 'shared/utils';

export const getAggregateOperationShortLabel = (
  operation: ExtendedAggregateOperations,
) => {
  switch (operation) {
    case AggregateOperations.MIN:
      return `Min`;
    case AggregateOperations.MAX:
      return `Maks`;
    case AggregateOperations.AVG:
      return `Rata-rata`;
    case AggregateOperations.SUM:
      return `Jumlah`;
    case AggregateOperations.COUNT:
      return `Semua`;
    case AggregateOperations.COUNT_EMPTY:
    case AggregateOperations.PERCENTAGE_EMPTY:
      return `Kosong`;
    case AggregateOperations.COUNT_NOT_EMPTY:
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return `Terisi`;
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return `Unik`;
    case DateAggregateOperations.EARLIEST:
      return `Terlama`;
    case DateAggregateOperations.LATEST:
      return `Terbaru`;
    case AggregateOperations.COUNT_TRUE:
      return `Benar`;
    case AggregateOperations.COUNT_FALSE:
      return `Salah`;
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

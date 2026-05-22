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
      return msg`Maks`;
    case AggregateOperations.AVG:
      return msg`Rata-rata`;
    case AggregateOperations.SUM:
      return msg`Jumlah`;
    case AggregateOperations.COUNT:
      return msg`Semua`;
    case AggregateOperations.COUNT_EMPTY:
    case AggregateOperations.PERCENTAGE_EMPTY:
      return msg`Kosong`;
    case AggregateOperations.COUNT_NOT_EMPTY:
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return msg`Terisi`;
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return msg`Unik`;
    case DateAggregateOperations.EARLIEST:
      return msg`Terlama`;
    case DateAggregateOperations.LATEST:
      return msg`Terbaru`;
    case AggregateOperations.COUNT_TRUE:
      return msg`Benar`;
    case AggregateOperations.COUNT_FALSE:
      return msg`Salah`;
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

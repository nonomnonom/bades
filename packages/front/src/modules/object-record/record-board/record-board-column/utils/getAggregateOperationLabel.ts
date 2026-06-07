import { AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';
import { type ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';
import { CustomError } from 'shared/utils';

export const getAggregateOperationLabel = (
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
      return `Hitung semua`;
    case AggregateOperations.COUNT_EMPTY:
      return `Hitung yang kosong`;
    case AggregateOperations.COUNT_NOT_EMPTY:
      return `Hitung yang terisi`;
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return `Hitung nilai unik`;
    case AggregateOperations.PERCENTAGE_EMPTY:
      return `Persentase kosong`;
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return `Persentase terisi`;
    case DateAggregateOperations.EARLIEST:
      return `Tanggal terlama`;
    case DateAggregateOperations.LATEST:
      return `Tanggal terbaru`;
    case AggregateOperations.COUNT_TRUE:
      return `Hitung yang benar`;
    case AggregateOperations.COUNT_FALSE:
      return `Hitung yang salah`;
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

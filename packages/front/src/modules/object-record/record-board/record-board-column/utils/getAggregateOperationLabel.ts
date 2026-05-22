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
      return t`Maks`;
    case AggregateOperations.AVG:
      return t`Rata-rata`;
    case AggregateOperations.SUM:
      return t`Jumlah`;
    case AggregateOperations.COUNT:
      return t`Hitung semua`;
    case AggregateOperations.COUNT_EMPTY:
      return t`Hitung yang kosong`;
    case AggregateOperations.COUNT_NOT_EMPTY:
      return t`Hitung yang terisi`;
    case AggregateOperations.COUNT_UNIQUE_VALUES:
      return t`Hitung nilai unik`;
    case AggregateOperations.PERCENTAGE_EMPTY:
      return t`Persentase kosong`;
    case AggregateOperations.PERCENTAGE_NOT_EMPTY:
      return t`Persentase terisi`;
    case DateAggregateOperations.EARLIEST:
      return t`Tanggal terlama`;
    case DateAggregateOperations.LATEST:
      return t`Tanggal terbaru`;
    case AggregateOperations.COUNT_TRUE:
      return t`Hitung yang benar`;
    case AggregateOperations.COUNT_FALSE:
      return t`Hitung yang salah`;
    default:
      throw new CustomError(
        `Unknown aggregate operation: ${operation}`,
        'UNKNOWN_AGGREGATE_OPERATION',
      );
  }
};

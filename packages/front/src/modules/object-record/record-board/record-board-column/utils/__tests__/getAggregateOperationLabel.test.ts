import { getAggregateOperationLabel } from '@/object-record/record-board/record-board-column/utils/getAggregateOperationLabel';
import { AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';

describe('getAggregateOperationLabel', () => {
  it('should return correct labels for each operation', () => {
    expect(getAggregateOperationLabel(AggregateOperations.MIN)).toBe('Min');
    expect(getAggregateOperationLabel(AggregateOperations.MAX)).toBe('Maks');
    expect(getAggregateOperationLabel(AggregateOperations.AVG)).toBe(
      'Rata-rata',
    );
    expect(getAggregateOperationLabel(DateAggregateOperations.EARLIEST)).toBe(
      'Tanggal terlama',
    );
    expect(getAggregateOperationLabel(DateAggregateOperations.LATEST)).toBe(
      'Tanggal terbaru',
    );
    expect(getAggregateOperationLabel(AggregateOperations.SUM)).toBe('Jumlah');
    expect(getAggregateOperationLabel(AggregateOperations.COUNT)).toBe(
      'Hitung semua',
    );
    expect(getAggregateOperationLabel(AggregateOperations.COUNT_EMPTY)).toBe(
      'Hitung yang kosong',
    );
    expect(
      getAggregateOperationLabel(AggregateOperations.COUNT_NOT_EMPTY),
    ).toBe('Hitung yang terisi');
    expect(
      getAggregateOperationLabel(AggregateOperations.COUNT_UNIQUE_VALUES),
    ).toBe('Hitung nilai unik');
    expect(
      getAggregateOperationLabel(AggregateOperations.PERCENTAGE_EMPTY),
    ).toBe('Persentase kosong');
    expect(
      getAggregateOperationLabel(AggregateOperations.PERCENTAGE_NOT_EMPTY),
    ).toBe('Persentase terisi');
  });

  it('should throw error for unknown operation', () => {
    expect(() =>
      getAggregateOperationLabel('INVALID' as AggregateOperations),
    ).toThrow('Unknown aggregate operation: INVALID');
  });
});

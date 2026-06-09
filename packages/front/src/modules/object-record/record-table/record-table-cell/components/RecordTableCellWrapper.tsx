import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { RecordTableCellContext } from '@/object-record/record-table/contexts/RecordTableCellContext';
import { useRecordTableRowContextOrThrow } from '@/object-record/record-table/contexts/RecordTableRowContext';
import { RecordTableCellFieldContextWrapper } from '@/object-record/record-table/record-table-cell/components/RecordTableCellFieldContextWrapper';
import { type TableCellPosition } from '@/object-record/record-table/types/TableCellPosition';
import { useMemo } from 'react';

export const RecordTableCellWrapper = ({
  children,
  recordField,
  recordFieldIndex,
}: {
  recordField: RecordField;
  recordFieldIndex: number;
  children: React.ReactNode;
}) => {
  const { rowIndex } = useRecordTableRowContextOrThrow();

  const currentTableCellPosition: TableCellPosition = useMemo(
    () => ({
      column: recordFieldIndex,
      row: rowIndex,
    }),
    [recordFieldIndex, rowIndex],
  );

  const cellContextValue = useMemo(
    () => ({
      recordField,
      cellPosition: currentTableCellPosition,
    }),
    [recordField, currentTableCellPosition],
  );

  return (
    <RecordTableCellContext.Provider
      value={cellContextValue}
      key={recordField.fieldMetadataItemId}
    >
      <RecordTableCellFieldContextWrapper recordField={recordField}>
        {children}
      </RecordTableCellFieldContextWrapper>
    </RecordTableCellContext.Provider>
  );
};

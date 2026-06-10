import { RecordBoardColumnHeader } from '@/object-record/record-board/record-board-column/components/RecordBoardColumnHeader';
import { RecordBoardColumnContext } from '@/object-record/record-board/record-board-column/contexts/RecordBoardColumnContext';
import { useShouldHideRecordGroup } from '@/object-record/record-group/hooks/useShouldHideRecordGroup';
import { recordGroupDefinitionFamilyState } from '@/object-record/record-group/states/recordGroupDefinitionFamilyState';
import { recordIndexRecordIdsByGroupComponentFamilyState } from '@/object-record/record-index/states/recordIndexRecordIdsByGroupComponentFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useAtomComponentFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentFamilyStateValue';
import { useMemo } from 'react';
import { isDefined } from 'shared/utils';

type RecordBoardColumnHeaderWrapperProps = {
  columnId: string;
  columnIndex: number;
};

export const RecordBoardColumnHeaderWrapper = ({
  columnId,
  columnIndex,
}: RecordBoardColumnHeaderWrapperProps) => {
  const recordGroupDefinition = useAtomFamilyStateValue(
    recordGroupDefinitionFamilyState,
    columnId,
  );

  const recordIndexRecordIdsByGroup = useAtomComponentFamilyStateValue(
    recordIndexRecordIdsByGroupComponentFamilyState,
    columnId,
  );

  const shouldHide = useShouldHideRecordGroup(columnId);

  if (shouldHide) {
    return null;
  }

  if (!isDefined(recordGroupDefinition)) {
    return null;
  }

  const contextValue = useMemo(
    () => ({
      columnId,
      columnDefinition: recordGroupDefinition,
      recordIds: recordIndexRecordIdsByGroup,
      columnIndex,
    }),
    [columnId, recordGroupDefinition, recordIndexRecordIdsByGroup, columnIndex],
  );

  return (
    <RecordBoardColumnContext.Provider value={contextValue}>
      <RecordBoardColumnHeader />
    </RecordBoardColumnContext.Provider>
  );
};

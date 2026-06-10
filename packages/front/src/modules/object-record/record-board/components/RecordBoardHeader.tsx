import { RecordBoardColumnHeaderWrapper } from '@/object-record/record-board/record-board-column/components/RecordBoardColumnHeaderWrapper';
import { RecordGroupContext } from '@/object-record/record-group/states/context/RecordGroupContext';
import { visibleRecordGroupIdsComponentFamilySelector } from '@/object-record/record-group/states/selectors/visibleRecordGroupIdsComponentFamilySelector';
import { RecordIndexGroupAggregatesDataLoader } from '@/object-record/record-index/components/RecordIndexGroupAggregatesDataLoader';
import { useAtomComponentFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentFamilySelectorValue';
import { ViewType } from '@/views/types/ViewType';
import { styled } from '@linaria/react';
import { useMemo } from 'react';
import { themeCssVariables } from 'ui/theme-constants';

const StyledHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  overflow: visible;

  width: 100%;
  z-index: 10;

  &.header-sticky {
    position: sticky;
    top: 0;
  }

  & > *:not(:first-of-type) {
    border-left: 1px solid ${themeCssVariables.border.color.light};
  }
`;

const RecordGroupContextProvider = ({
  recordGroupId,
  children,
}: {
  recordGroupId: string;
  children: React.ReactNode;
}) => {
  const contextValue = useMemo(
    () => ({ recordGroupId }),
    [recordGroupId],
  );
  return (
    <RecordGroupContext.Provider value={contextValue}>
      {children}
    </RecordGroupContext.Provider>
  );
};

export const RecordBoardHeader = () => {
  const visibleRecordGroupIds = useAtomComponentFamilySelectorValue(
    visibleRecordGroupIdsComponentFamilySelector,
    ViewType.KANBAN,
  );

  return (
    <StyledHeaderContainer id="record-board-header">
      {visibleRecordGroupIds.map((recordGroupId, index) => (
        <RecordGroupContextProvider key={recordGroupId} recordGroupId={recordGroupId}>
          <RecordBoardColumnHeaderWrapper
            columnId={recordGroupId}
            columnIndex={index}
          />
        </RecordGroupContextProvider>
      ))}
      <RecordIndexGroupAggregatesDataLoader />
    </StyledHeaderContainer>
  );
};

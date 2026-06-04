import { RecordIndexTableContainerEffect } from '@/object-record/record-index/components/RecordIndexTableContainerEffect';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { RecordIndexMapContainer } from '@/object-record/record-map/components/RecordIndexMapContainer';
import { RecordTableWidgetSetReadOnlyColumnHeadersEffect } from '@/object-record/record-table-widget/components/RecordTableWidgetSetReadOnlyColumnHeadersEffect';
import { RecordTableWithWrappers } from '@/object-record/record-table/components/RecordTableWithWrappers';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { ViewType } from '@/views/types/ViewType';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'ui/theme-constants';

const StyledTableContainer = styled.div`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  overflow: hidden;
`;

const StyledMapContainer = styled.div`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 100%;
  min-height: 240px;
  overflow: hidden;
`;

export const RecordTableWidget = () => {
  const { objectNameSingular, recordIndexId, viewBarInstanceId } =
    useRecordIndexContextOrThrow();

  const recordIndexViewType = useAtomStateValue(recordIndexViewTypeState);

  if (recordIndexViewType === ViewType.MAP) {
    return (
      <StyledMapContainer>
        <RecordIndexMapContainer viewBarInstanceId={viewBarInstanceId} />
      </StyledMapContainer>
    );
  }

  return (
    <>
      <RecordTableWidgetSetReadOnlyColumnHeadersEffect
        recordTableId={recordIndexId}
      />
      <RecordIndexTableContainerEffect />
      <StyledTableContainer>
        <RecordTableWithWrappers
          recordTableId={recordIndexId}
          objectNameSingular={objectNameSingular}
          viewBarId={viewBarInstanceId}
        />
      </StyledTableContainer>
    </>
  );
};

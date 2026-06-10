import { RecordGroupContext } from '@/object-record/record-group/states/context/RecordGroupContext';
import { recordGroupIdsComponentState } from '@/object-record/record-group/states/recordGroupIdsComponentState';
import { RecordTableRecordGroupBodyEffect } from '@/object-record/record-table/record-table-body/components/RecordTableRecordGroupBodyEffect';
import { useMemo } from 'react';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

const RecordTableRecordGroupBodyEffectItem = ({
  recordGroupId,
}: {
  recordGroupId: string;
}) => {
  const groupContextValue = useMemo(
    () => ({ recordGroupId }),
    [recordGroupId],
  );

  return (
    <RecordGroupContext.Provider value={groupContextValue}>
      <RecordTableRecordGroupBodyEffect />
    </RecordGroupContext.Provider>
  );
};

export const RecordTableRecordGroupBodyEffects = () => {
  const recordGroupIds = useAtomComponentStateValue(
    recordGroupIdsComponentState,
  );

  return recordGroupIds.map((recordGroupId) => (
    <RecordTableRecordGroupBodyEffectItem
      key={recordGroupId}
      recordGroupId={recordGroupId}
    />
  ));
};

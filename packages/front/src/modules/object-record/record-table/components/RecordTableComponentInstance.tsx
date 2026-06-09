import { useMemo, type ReactNode } from 'react';

import { RecordTableComponentInstanceContext } from '@/object-record/record-table/states/context/RecordTableComponentInstanceContext';

type RecordTableComponentInstanceProps = {
  children: ReactNode;
  recordTableId: string;
};

export const RecordTableComponentInstance = ({
  children,
  recordTableId,
}: RecordTableComponentInstanceProps) => {
  const value = useMemo(
    () => ({ instanceId: recordTableId }),
    [recordTableId],
  );

  return (
    <RecordTableComponentInstanceContext.Provider
      value={value}
    >
      {children}
    </RecordTableComponentInstanceContext.Provider>
  );
};

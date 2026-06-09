import { RecordCalendarComponentInstanceContext } from '@/object-record/record-calendar/states/contexts/RecordCalendarComponentInstanceContext';
import { RecordFieldsComponentInstanceContext } from '@/object-record/record-field/states/context/RecordFieldsComponentInstanceContext';
import { RecordFilterGroupsComponentInstanceContext } from '@/object-record/record-filter-group/states/context/RecordFilterGroupsComponentInstanceContext';
import { RecordFiltersComponentInstanceContext } from '@/object-record/record-filter/states/context/RecordFiltersComponentInstanceContext';
import { RecordSortsComponentInstanceContext } from '@/object-record/record-sort/states/context/RecordSortsComponentInstanceContext';
import { useMemo, type PropsWithChildren } from 'react';

export type RecordComponentInstanceContextsWrapperProps = PropsWithChildren<{
  componentInstanceId: string;
}>;

export const RecordComponentInstanceContextsWrapper = ({
  componentInstanceId,
  children,
}: RecordComponentInstanceContextsWrapperProps) => {
  const instanceValue = useMemo(
    () => ({ instanceId: componentInstanceId }),
    [componentInstanceId],
  );

  return (
    <RecordFilterGroupsComponentInstanceContext.Provider
      value={instanceValue}
    >
      <RecordFiltersComponentInstanceContext.Provider
        value={instanceValue}
      >
        <RecordSortsComponentInstanceContext.Provider
          value={instanceValue}
        >
          <RecordFieldsComponentInstanceContext.Provider
            value={instanceValue}
          >
            <RecordCalendarComponentInstanceContext.Provider
              value={instanceValue}
            >
              {children}
            </RecordCalendarComponentInstanceContext.Provider>
          </RecordFieldsComponentInstanceContext.Provider>
        </RecordSortsComponentInstanceContext.Provider>
      </RecordFiltersComponentInstanceContext.Provider>
    </RecordFilterGroupsComponentInstanceContext.Provider>
  );
};

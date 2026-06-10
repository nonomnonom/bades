import { useSetAdvancedFilterDropdownStates } from '@/object-record/advanced-filter/hooks/useSetAdvancedFilterDropdownAllRowsStates';
import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useAtomComponentFamilyState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentFamilyState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { hasInitializedCurrentRecordFilterGroupsComponentFamilyState } from '@/views/states/hasInitializedCurrentRecordFilterGroupsComponentFamilyState';
import { hasInitializedCurrentRecordFiltersComponentFamilyState } from '@/views/states/hasInitializedCurrentRecordFiltersComponentFamilyState';
import { type FindRecordsActionFilter } from '@/workflow/workflow-steps/workflow-actions/find-records-action/components/WorkflowEditActionFindRecords';
import { useEffect, useRef } from 'react';

import { isDefined } from 'shared/utils';
export const WorkflowFindRecordsFiltersEffect = ({
  defaultValue,
}: {
  defaultValue?: FindRecordsActionFilter;
}) => {
  const [, setHasInitializedCurrentRecordFilters] = useAtomComponentFamilyState(
    hasInitializedCurrentRecordFiltersComponentFamilyState,
    {},
  );

  const [, setHasInitializedCurrentRecordFilterGroups] =
    useAtomComponentFamilyState(
      hasInitializedCurrentRecordFilterGroupsComponentFamilyState,
      {},
    );

  const setCurrentRecordFilters = useSetAtomComponentState(
    currentRecordFiltersComponentState,
  );

  const setCurrentRecordFilterGroups = useSetAtomComponentState(
    currentRecordFilterGroupsComponentState,
  );

  const { setAdvancedFilterDropdownStates } =
    useSetAdvancedFilterDropdownStates();

  // oxlint-disable-next-line bades/no-state-useref
  const hasInitializedRecordFiltersRef = useRef(false);
  // oxlint-disable-next-line bades/no-state-useref
  const hasInitializedRecordFilterGroupsRef = useRef(false);

  useEffect(() => {
    if (
      !hasInitializedRecordFiltersRef.current &&
      isDefined(defaultValue?.recordFilters)
    ) {
      setCurrentRecordFilters(defaultValue.recordFilters ?? []);
      setAdvancedFilterDropdownStates();
      hasInitializedRecordFiltersRef.current = true;
      setHasInitializedCurrentRecordFilters(true);
    }
  }, [
    setCurrentRecordFilters,
    defaultValue?.recordFilters,
    setAdvancedFilterDropdownStates,
    setHasInitializedCurrentRecordFilters,
  ]);

  useEffect(() => {
    if (
      !hasInitializedRecordFilterGroupsRef.current &&
      isDefined(defaultValue?.recordFilterGroups) &&
      defaultValue.recordFilterGroups.length > 0
    ) {
      setCurrentRecordFilterGroups(defaultValue.recordFilterGroups ?? []);
      hasInitializedRecordFilterGroupsRef.current = true;
      setHasInitializedCurrentRecordFilterGroups(true);
    }
  }, [
    setCurrentRecordFilterGroups,
    defaultValue?.recordFilterGroups,
    setHasInitializedCurrentRecordFilterGroups,
  ]);

  return null;
};

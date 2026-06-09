import { useSetAdvancedFilterDropdownStates } from '@/object-record/advanced-filter/hooks/useSetAdvancedFilterDropdownAllRowsStates';
import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useAtomComponentFamilyState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentFamilyState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { hasInitializedCurrentRecordFilterGroupsComponentFamilyState } from '@/views/states/hasInitializedCurrentRecordFilterGroupsComponentFamilyState';
import { hasInitializedCurrentRecordFiltersComponentFamilyState } from '@/views/states/hasInitializedCurrentRecordFiltersComponentFamilyState';
import { type FindRecordsActionFilter } from '@/workflow/workflow-steps/workflow-actions/find-records-action/components/WorkflowEditActionFindRecords';
import { useEffect, useState } from 'react';

import { isDefined } from 'shared/utils';

export const WorkflowFindRecordsFiltersEffect = ({
  defaultValue,
}: {
  defaultValue?: FindRecordsActionFilter;
}) => {
  const [hasInitializedRecordFilters, setHasInitializedRecordFilters] =
    useState(false);
  const [
    hasInitializedRecordFilterGroups,
    setHasInitializedRecordFilterGroups,
  ] = useState(false);

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

  const [
    shouldSetAdvancedFilterDropdownStates,
    setShouldSetAdvancedFilterDropdownStates,
  ] = useState(false);

  useEffect(() => {
    if (
      !hasInitializedRecordFilters &&
      isDefined(defaultValue?.recordFilters)
    ) {
      setCurrentRecordFilters(defaultValue.recordFilters ?? []);
      setShouldSetAdvancedFilterDropdownStates(true);
      setHasInitializedRecordFilters(true);
      setHasInitializedCurrentRecordFilters(true);
    }
  }, [
    setCurrentRecordFilters,
    defaultValue?.recordFilters,
    setHasInitializedCurrentRecordFilters,
    setShouldSetAdvancedFilterDropdownStates,
    hasInitializedRecordFilters,
  ]);

  useEffect(() => {
    if (
      !hasInitializedRecordFilterGroups &&
      isDefined(defaultValue?.recordFilterGroups) &&
      defaultValue.recordFilterGroups.length > 0
    ) {
      setCurrentRecordFilterGroups(defaultValue.recordFilterGroups ?? []);
      setHasInitializedRecordFilterGroups(true);
      setHasInitializedCurrentRecordFilterGroups(true);
    }
  }, [
    setCurrentRecordFilterGroups,
    defaultValue?.recordFilterGroups,
    setHasInitializedCurrentRecordFilterGroups,
    hasInitializedRecordFilterGroups,
  ]);

  useEffect(() => {
    if (shouldSetAdvancedFilterDropdownStates) {
      setAdvancedFilterDropdownStates();
      setShouldSetAdvancedFilterDropdownStates(false);
    }
  }, [shouldSetAdvancedFilterDropdownStates, setAdvancedFilterDropdownStates]);

  return null;
};

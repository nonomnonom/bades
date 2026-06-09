import { useEffect, useState } from 'react';

import { hasInitializedChartFiltersComponentState } from '@/side-panel/pages/page-layout/states/hasInitializedChartFiltersComponentState';
import { type ChartFilters } from '@/side-panel/pages/page-layout/types/ChartFilters';
import { useSetAdvancedFilterDropdownStates } from '@/object-record/advanced-filter/hooks/useSetAdvancedFilterDropdownAllRowsStates';
import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';

import { isDefined } from 'shared/utils';

export type ChartFiltersSettingsInitializeStateEffectProps = {
  initialChartFilters?: ChartFilters;
};

export const ChartFiltersSettingsInitializeStateEffect = ({
  initialChartFilters,
}: ChartFiltersSettingsInitializeStateEffectProps) => {
  const [hasInitializedChartFilters, setHasInitializedChartFiltersLocal] =
    useState(false);

  const setHasInitializedChartFiltersAtom = useAtomComponentState(
    hasInitializedChartFiltersComponentState,
  )[1];

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
    if (!hasInitializedChartFilters && isDefined(initialChartFilters)) {
      setCurrentRecordFilters(initialChartFilters.recordFilters ?? []);
      setCurrentRecordFilterGroups(
        initialChartFilters.recordFilterGroups ?? [],
      );

      setShouldSetAdvancedFilterDropdownStates(true);
      setHasInitializedChartFiltersLocal(true);
      setHasInitializedChartFiltersAtom(true);
    }
  }, [
    setCurrentRecordFilters,
    setCurrentRecordFilterGroups,
    initialChartFilters,
    setShouldSetAdvancedFilterDropdownStates,
    hasInitializedChartFilters,
    setHasInitializedChartFiltersAtom,
  ]);

  useEffect(() => {
    if (shouldSetAdvancedFilterDropdownStates) {
      setAdvancedFilterDropdownStates();
      setShouldSetAdvancedFilterDropdownStates(false);
    }
  }, [shouldSetAdvancedFilterDropdownStates, setAdvancedFilterDropdownStates]);

  return null;
};

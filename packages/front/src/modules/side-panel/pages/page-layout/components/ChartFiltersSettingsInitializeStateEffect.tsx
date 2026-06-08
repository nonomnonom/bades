import { useEffect, useRef, useState } from 'react';

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
  const hasInitializedChartFiltersRef = useRef(false);

  const setHasInitializedChartFilters = useAtomComponentState(
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
    if (!hasInitializedChartFiltersRef.current && isDefined(initialChartFilters)) {
      setCurrentRecordFilters(initialChartFilters.recordFilters ?? []);
      setCurrentRecordFilterGroups(
        initialChartFilters.recordFilterGroups ?? [],
      );

      setShouldSetAdvancedFilterDropdownStates(true);
      hasInitializedChartFiltersRef.current = true;
      setHasInitializedChartFilters(true);
    }
  }, [
    setCurrentRecordFilters,
    setCurrentRecordFilterGroups,
    initialChartFilters,
  ]);

  useEffect(() => {
    if (shouldSetAdvancedFilterDropdownStates) {
      setAdvancedFilterDropdownStates();
      setShouldSetAdvancedFilterDropdownStates(false);
    }
  }, [shouldSetAdvancedFilterDropdownStates, setAdvancedFilterDropdownStates]);

  return null;
};

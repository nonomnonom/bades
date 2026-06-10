import { useEffect, useRef } from 'react';

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

  // oxlint-disable-next-line bades/no-state-useref
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedRef.current && isDefined(initialChartFilters)) {
      setCurrentRecordFilters(initialChartFilters.recordFilters ?? []);
      setCurrentRecordFilterGroups(
        initialChartFilters.recordFilterGroups ?? [],
      );

      setAdvancedFilterDropdownStates();
      hasInitializedRef.current = true;
      setHasInitializedChartFiltersAtom(true);
    }
  }, [
    setCurrentRecordFilters,
    setCurrentRecordFilterGroups,
    initialChartFilters,
    setAdvancedFilterDropdownStates,
    setHasInitializedChartFiltersAtom,
  ]);

  return null;
};

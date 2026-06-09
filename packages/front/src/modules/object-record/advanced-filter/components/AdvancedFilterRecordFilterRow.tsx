import { AdvancedFilterDropdownRow } from '@/object-record/advanced-filter/components/AdvancedFilterDropdownRow';
import { AdvancedFilterFieldSelectDropdownButton } from '@/object-record/advanced-filter/components/AdvancedFilterFieldSelectDropdownButton';
import { AdvancedFilterLogicalOperatorCell } from '@/object-record/advanced-filter/components/AdvancedFilterLogicalOperatorCell';
import { AdvancedFilterRecordFilterOperandSelect } from '@/object-record/advanced-filter/components/AdvancedFilterRecordFilterOperandSelect';
import { AdvancedFilterRecordFilterOptionsDropdown } from '@/object-record/advanced-filter/components/AdvancedFilterRecordFilterOptionsDropdown';
import { AdvancedFilterValueInput } from '@/object-record/advanced-filter/components/AdvancedFilterValueInput';
import { getAdvancedFilterObjectFilterDropdownComponentInstanceId } from '@/object-record/advanced-filter/utils/getAdvancedFilterObjectFilterDropdownComponentInstanceId';
import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { type RecordFilterGroup } from '@/object-record/record-filter-group/types/RecordFilterGroup';
import { type RecordFilter } from '@/object-record/record-filter/types/RecordFilter';
import { useMemo } from 'react';

export const AdvancedFilterRecordFilterRow = ({
  recordFilterGroup,
  recordFilter,
  recordFilterIndex,
}: {
  recordFilterGroup: RecordFilterGroup;
  recordFilter: RecordFilter;
  recordFilterIndex: number;
}) => {
  const instanceValue = useMemo(
    () => ({
      instanceId: getAdvancedFilterObjectFilterDropdownComponentInstanceId(
        recordFilter.id,
      ),
    }),
    [recordFilter.id],
  );

  return (
    <ObjectFilterDropdownComponentInstanceContext.Provider
      value={instanceValue}
    >
      <AdvancedFilterDropdownRow>
        <AdvancedFilterLogicalOperatorCell
          index={recordFilterIndex}
          recordFilterGroup={recordFilterGroup}
        />

        <AdvancedFilterFieldSelectDropdownButton
          recordFilterId={recordFilter.id}
        />
        <AdvancedFilterRecordFilterOperandSelect
          recordFilterId={recordFilter.id}
        />
        <AdvancedFilterValueInput recordFilterId={recordFilter.id} />
        <AdvancedFilterRecordFilterOptionsDropdown
          recordFilterId={recordFilter.id}
        />
      </AdvancedFilterDropdownRow>
    </ObjectFilterDropdownComponentInstanceContext.Provider>
  );
};

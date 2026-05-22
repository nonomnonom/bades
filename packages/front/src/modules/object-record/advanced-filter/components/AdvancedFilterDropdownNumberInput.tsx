import { t } from '~/utils/i18n/badesI18n';
import { useApplyObjectFilterDropdownFilterValue } from '@/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownFilterValue';
import { useObjectFilterDropdownFilterValue } from '@/object-record/object-filter-dropdown/hooks/useObjectFilterDropdownFilterValue';
import { fieldMetadataItemUsedInDropdownComponentSelector } from '@/object-record/object-filter-dropdown/states/fieldMetadataItemUsedInDropdownComponentSelector';
import { selectedOperandInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/selectedOperandInDropdownComponentState';
import { TextInput } from '@/ui/input/components/TextInput';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

export const AdvancedFilterDropdownNumberInput = () => {
  const selectedOperandInDropdown = useAtomComponentStateValue(
    selectedOperandInDropdownComponentState,
  );

  const fieldMetadataItemUsedInDropdown = useAtomComponentSelectorValue(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );

  const { objectFilterDropdownFilterValue } =
    useObjectFilterDropdownFilterValue();

  const { applyObjectFilterDropdownFilterValue } =
    useApplyObjectFilterDropdownFilterValue();

  const handleChange = (newValue: string) => {
    applyObjectFilterDropdownFilterValue(newValue);
  };

  if (!selectedOperandInDropdown || !fieldMetadataItemUsedInDropdown) {
    return null;
  }

  return (
    <TextInput
      value={objectFilterDropdownFilterValue}
      onChange={handleChange}
      placeholder={t`Masukkan nilai`}
      fullWidth
      type="number"
    />
  );
};

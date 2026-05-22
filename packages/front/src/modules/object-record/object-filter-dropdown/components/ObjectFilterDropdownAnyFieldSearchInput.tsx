import { useLingui } from '~/utils/i18n/badesI18n';
import { anyFieldFilterValueComponentState } from '@/object-record/record-filter/states/anyFieldFilterValueComponentState';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';

export const ObjectFilterDropdownAnyFieldSearchInput = () => {
  const { t } = useLingui();

  const [anyFieldFilterValue, setAnyFieldFilterValue] = useAtomComponentState(
    anyFieldFilterValueComponentState,
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setAnyFieldFilterValue(inputValue);
  };

  return (
    <DropdownMenuSearchInput
      autoFocus
      type="text"
      value={anyFieldFilterValue}
      placeholder={t`Cari di semua kolom`}
      onChange={handleSearchChange}
    />
  );
};

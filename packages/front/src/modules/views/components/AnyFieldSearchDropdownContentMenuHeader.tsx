import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useLingui } from '~/utils/i18n/badesI18n';
import { IconX } from 'ui/display';

export const AnyFieldSearchDropdownContentMenuHeader = () => {
  const { t } = useLingui();

  const { closeDropdown } = useCloseDropdown();

  const handleBackButtonClick = () => {
    closeDropdown();
  };

  return (
    <DropdownMenuHeader
      StartComponent={
        <DropdownMenuHeaderLeftComponent
          onClick={handleBackButtonClick}
          Icon={IconX}
        />
      }
    >
      {t`Cari di semua kolom`}
    </DropdownMenuHeader>
  );
};

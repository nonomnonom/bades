import { useResetFilterDropdown } from '@/object-record/object-filter-dropdown/hooks/useResetFilterDropdown';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { useLingui } from '~/utils/i18n/badesI18n';
import { IconChevronLeft } from 'ui/display';

export const ViewBarFilterDropdownAnyFieldSearchInputDropdownHeader = () => {
  const { t } = useLingui();

  const { resetFilterDropdown } = useResetFilterDropdown();

  const handleBackButtonClick = () => {
    resetFilterDropdown();
  };

  return (
    <DropdownMenuHeader
      StartComponent={
        <DropdownMenuHeaderLeftComponent
          onClick={handleBackButtonClick}
          Icon={IconChevronLeft}
        />
      }
    >
      {t`Cari di semua kolom`}
    </DropdownMenuHeader>
  );
};

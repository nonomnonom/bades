import { useLingui } from '~/utils/i18n/badesI18n';
import { useObjectOptionsDropdown } from '@/object-record/object-options-dropdown/hooks/useObjectOptionsDropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { ViewFieldsSearchDropdownSection } from '@/views/components/ViewFieldsSearchDropdownSection';
import { ViewFieldsVisibleDropdownSection } from '@/views/components/ViewFieldsVisibleDropdownSection';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { IconChevronLeft, IconEyeOff } from 'ui/display';
import { MenuItemNavigate } from 'ui/navigation';

export const ObjectOptionsDropdownFieldsContent = () => {
  const { t } = useLingui();
  const [searchInput, setSearchInput] = useState('');

  const { onContentChange, resetContent } = useObjectOptionsDropdown();

  return (
    <DropdownContent>
      <DropdownMenuHeader
        StartComponent={
          <DropdownMenuHeaderLeftComponent
            onClick={resetContent}
            Icon={IconChevronLeft}
          />
        }
      >
        {t`Kolom`}
      </DropdownMenuHeader>
      <DropdownMenuSearchInput
        autoFocus
        value={searchInput}
        placeholder={t`Cari kolom`}
        onChange={(event) => setSearchInput(event.target.value)}
      />
      <DropdownMenuSeparator />
      {isNonEmptyString(searchInput) ? (
        <ViewFieldsSearchDropdownSection searchInput={searchInput} />
      ) : (
        <>
          <ViewFieldsVisibleDropdownSection />
          <DropdownMenuSeparator />
          <DropdownMenuItemsContainer scrollable={false}>
            <MenuItemNavigate
              onClick={() => onContentChange('hiddenFields')}
              LeftIcon={IconEyeOff}
              text={t`Kolom tersembunyi`}
            />
          </DropdownMenuItemsContainer>
        </>
      )}
    </DropdownContent>
  );
};

import { t } from '~/utils/i18n/badesI18n';
import { useChildRecordFiltersAndRecordFilterGroups } from '@/object-record/advanced-filter/hooks/useChildRecordFiltersAndRecordFilterGroups';
import { useRemoveRecordFilterGroup } from '@/object-record/record-filter-group/hooks/useRemoveRecordFilterGroup';
import { useRemoveRootRecordFilterGroupIfEmpty } from '@/object-record/record-filter-group/hooks/useRemoveRootRecordFilterGroupIfEmpty';
import { useRemoveRecordFilter } from '@/object-record/record-filter/hooks/useRemoveRecordFilter';

import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { IconDotsVertical, IconTrash } from 'ui/display';
import { IconButton } from 'ui/input';
import { MenuItem } from 'ui/navigation';

type AdvancedFilterRecordFilterGroupOptionsDropdownProps = {
  recordFilterGroupId: string;
};

export const AdvancedFilterRecordFilterGroupOptionsDropdown = ({
  recordFilterGroupId,
}: AdvancedFilterRecordFilterGroupOptionsDropdownProps) => {
  const dropdownId = `advanced-filter-record-filter-group-options-${recordFilterGroupId}`;

  const { closeDropdown } = useCloseDropdown();

  const { removeRecordFilter } = useRemoveRecordFilter();
  const { removeRecordFilterGroup } = useRemoveRecordFilterGroup();
  const { removeRootRecordFilterGroupIfEmpty } =
    useRemoveRootRecordFilterGroupIfEmpty();

  const { childRecordFilters } = useChildRecordFiltersAndRecordFilterGroups({
    recordFilterGroupId,
  });

  const handleRemove = () => {
    for (const childRecordFilter of childRecordFilters ?? []) {
      removeRecordFilter({ recordFilterId: childRecordFilter.id });
    }

    removeRecordFilterGroup(recordFilterGroupId);

    removeRootRecordFilterGroupIfEmpty();

    closeDropdown(dropdownId);
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={
        <IconButton
          aria-label={t`Opsi grup aturan filter`}
          variant="tertiary"
          Icon={IconDotsVertical}
        />
      }
      dropdownComponents={
        <DropdownContent>
          <DropdownMenuItemsContainer>
            <MenuItem
              text={t`Hapus grup aturan`}
              onClick={handleRemove}
              LeftIcon={IconTrash}
              accent="danger"
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
      dropdownOffset={{ y: 2, x: 0 }}
      dropdownPlacement="bottom-start"
    />
  );
};

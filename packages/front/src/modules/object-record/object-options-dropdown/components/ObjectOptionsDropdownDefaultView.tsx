import { useLingui } from '~/utils/i18n/badesI18n';
import { OBJECT_OPTIONS_DROPDOWN_ID } from '@/object-record/object-options-dropdown/constants/ObjectOptionsDropdownId';
import { useObjectOptionsDropdown } from '@/object-record/object-options-dropdown/hooks/useObjectOptionsDropdown';
import { visibleRecordFieldsComponentSelector } from '@/object-record/record-field/states/visibleRecordFieldsComponentSelector';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { SelectableList } from '@/ui/layout/selectable-list/components/SelectableList';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { selectedItemIdComponentState } from '@/ui/layout/selectable-list/states/selectedItemIdComponentState';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';
import { useOpenCreateViewDropdown } from '@/views/hooks/useOpenCreateViewDropown';
import {
  IconCopy,
  IconLayout,
  IconListDetails,
  IconLock,
  useIcons,
} from 'ui/display';
import { MenuItem } from 'ui/navigation';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const ObjectOptionsDropdownDefaultView = () => {
  const { t } = useLingui();
  const { recordIndexId, onContentChange } = useObjectOptionsDropdown();

  const { currentView } = useGetCurrentViewOnly();

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
    recordIndexId,
  );

  const visibleFieldsCount = visibleRecordFields.length;

  const selectableItemIdArray = [
    'Kolom',
    'Salin tautan tampilan',
    'Buat tampilan kustom',
  ];

  const selectedItemId = useAtomComponentStateValue(
    selectedItemIdComponentState,
    OBJECT_OPTIONS_DROPDOWN_ID,
  );

  const { openCreateViewDropdown } = useOpenCreateViewDropdown(recordIndexId);
  const { closeDropdown } = useCloseDropdown();

  const handleCreateCustomView = () => {
    closeDropdown(OBJECT_OPTIONS_DROPDOWN_ID);

    openCreateViewDropdown(currentView);
  };

  const { copyToClipboard } = useCopyToClipboard();

  const { getIcon } = useIcons();
  const MainIcon = getIcon(currentView?.icon);

  return (
    <DropdownContent>
      <DropdownMenuItemsContainer scrollable={false}>
        <MenuItem
          text={t`Tampilan Bawaan`}
          LeftIcon={MainIcon}
          RightIcon={IconLock}
          disabled={true}
        />
      </DropdownMenuItemsContainer>
      <DropdownMenuSeparator />
      <SelectableList
        selectableListInstanceId={OBJECT_OPTIONS_DROPDOWN_ID}
        focusId={OBJECT_OPTIONS_DROPDOWN_ID}
        selectableItemIdArray={selectableItemIdArray}
      >
        <DropdownMenuItemsContainer scrollable={false}>
          <SelectableListItem
            itemId="Kolom"
            onEnter={() => onContentChange('fields')}
          >
            <MenuItem
              focused={selectedItemId === 'Kolom'}
              onClick={() => onContentChange('fields')}
              LeftIcon={IconListDetails}
              text={t`Kolom`}
              contextualText={t`${visibleFieldsCount} ditampilkan`}
              contextualTextPosition="right"
              hasSubMenu
            />
          </SelectableListItem>
        </DropdownMenuItemsContainer>
        <DropdownMenuSeparator />
        <DropdownMenuItemsContainer scrollable={false}>
          <SelectableListItem
            itemId="Salin tautan tampilan"
            onEnter={() => {
              const currentUrl = window.location.href;
              copyToClipboard(currentUrl, t`Tautan disalin`);
            }}
          >
            <MenuItem
              focused={selectedItemId === 'Salin tautan tampilan'}
              onClick={() => {
                const currentUrl = window.location.href;
                copyToClipboard(currentUrl, t`Tautan disalin`);
              }}
              LeftIcon={IconCopy}
              text={t`Salin tautan tampilan`}
            />
          </SelectableListItem>
          <SelectableListItem
            itemId="Buat tampilan kustom"
            onEnter={handleCreateCustomView}
          >
            <MenuItem
              focused={selectedItemId === 'Buat tampilan kustom'}
              onClick={handleCreateCustomView}
              LeftIcon={IconLayout}
              text={t`Buat tampilan kustom`}
              contextualTextPosition="right"
            />
          </SelectableListItem>
        </DropdownMenuItemsContainer>
      </SelectableList>
    </DropdownContent>
  );
};

import { useLingui } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { TintedIconTile, useIcons } from 'ui/display';

import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { FOLDER_ICON_DEFAULT } from '@/navigation-menu-item/common/constants/FolderIconDefault';
import { DEFAULT_NAVIGATION_MENU_ITEM_COLOR_FOLDER } from '@/navigation-menu-item/common/constants/NavigationMenuItemDefaultColorFolder';
import { useFolderPickerSelectionData } from '@/navigation-menu-item/edit/side-panel/hooks/useFolderPickerSelectionData';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { SidePanelSubViewWithSearch } from '@/side-panel/components/SidePanelSubViewWithSearch';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { filterBySearchQuery } from '~/utils/filterBySearchQuery';

export const SidePanelEditFolderPickerSubPage = () => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const [searchValue, setSearchValue] = useState('');
  const { foldersToShow, includeNoFolderOption, handleSelectFolder } =
    useFolderPickerSelectionData();

  const filteredFolders = filterBySearchQuery({
    items: foldersToShow,
    searchQuery: searchValue,
    getSearchableValues: (folder) => [folder.name],
  });
  const isEmpty = filteredFolders.length === 0 && !includeNoFolderOption;
  const selectableItemIds = [
    ...(includeNoFolderOption ? ['no-folder'] : []),
    ...(filteredFolders.length > 0 ? filteredFolders.map((f) => f.id) : []),
  ];
  const noResultsText =
    searchValue.trim().length > 0 ? t`Tidak ada hasil` : t`Belum ada folder`;

  return (
    <SidePanelSubViewWithSearch
      searchPlaceholder={t`Cari folder...`}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
    >
      <SidePanelList
        selectableItemIds={selectableItemIds}
        noResults={isEmpty}
        noResultsText={noResultsText}
      >
        <SidePanelGroup heading={t`Folder`}>
          {includeNoFolderOption && (
            <SelectableListItem
              itemId="no-folder"
              onEnter={() => handleSelectFolder(null)}
            >
              <CommandMenuItem
                label={t`Tanpa folder`}
                id="no-folder"
                onClick={() => handleSelectFolder(null)}
              />
            </SelectableListItem>
          )}
          {filteredFolders.map((folder) => {
            const FolderIcon = getIcon(folder.icon ?? FOLDER_ICON_DEFAULT);
            const folderColor =
              folder.color ?? DEFAULT_NAVIGATION_MENU_ITEM_COLOR_FOLDER;
            return (
              <SelectableListItem
                key={folder.id}
                itemId={folder.id}
                onEnter={() => handleSelectFolder(folder.id)}
              >
                <CommandMenuItem
                  LeftComponent={
                    <TintedIconTile Icon={FolderIcon} color={folderColor} />
                  }
                  label={folder.name}
                  id={folder.id}
                  onClick={() => handleSelectFolder(folder.id)}
                />
              </SelectableListItem>
            );
          })}
        </SidePanelGroup>
      </SidePanelList>
    </SidePanelSubViewWithSearch>
  );
};

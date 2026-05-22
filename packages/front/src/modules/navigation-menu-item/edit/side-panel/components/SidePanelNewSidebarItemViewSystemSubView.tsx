import { useLingui } from '~/utils/i18n/badesI18n';

import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { ObjectMetadataIcon } from '@/object-metadata/components/ObjectMetadataIcon';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { SidePanelSubViewWithSearch } from '@/side-panel/components/SidePanelSubViewWithSearch';
import { useSidePanelFilteredPickerItems } from '@/side-panel/hooks/useSidePanelFilteredPickerItems';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';

type SidePanelNewSidebarItemViewSystemSubViewProps = {
  systemObjects: EnrichedObjectMetadataItem[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectObject: (objectMetadataItem: EnrichedObjectMetadataItem) => void;
};

export const SidePanelNewSidebarItemViewSystemSubView = ({
  systemObjects,
  searchValue,
  onSearchChange,
  onSelectObject,
}: SidePanelNewSidebarItemViewSystemSubViewProps) => {
  const { t } = useLingui();
  const {
    filteredItems: filteredSystemObjectMetadataItems,
    selectableItemIds,
    isEmpty,
    hasSearchQuery,
  } = useSidePanelFilteredPickerItems({
    items: systemObjects,
    searchQuery: searchValue,
    getSearchableValues: (item) => [item.labelPlural],
  });
  const noResultsText = hasSearchQuery
    ? t`Tidak ada hasil`
    : t`Belum ada objek sistem dengan tampilan`;

  return (
    <SidePanelSubViewWithSearch
      searchPlaceholder={t`Cari objek sistem...`}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <SidePanelList
        selectableItemIds={selectableItemIds}
        noResults={isEmpty}
        noResultsText={noResultsText}
      >
        <SidePanelGroup heading={t`Objek sistem`}>
          {filteredSystemObjectMetadataItems.map((objectMetadataItem) => (
            <SelectableListItem
              key={objectMetadataItem.id}
              itemId={objectMetadataItem.id}
              onEnter={() => onSelectObject(objectMetadataItem)}
            >
              <CommandMenuItem
                Icon={() => (
                  <ObjectMetadataIcon objectMetadataItem={objectMetadataItem} />
                )}
                label={objectMetadataItem.labelPlural}
                id={objectMetadataItem.id}
                onClick={() => onSelectObject(objectMetadataItem)}
              />
            </SelectableListItem>
          ))}
        </SidePanelGroup>
      </SidePanelList>
    </SidePanelSubViewWithSearch>
  );
};

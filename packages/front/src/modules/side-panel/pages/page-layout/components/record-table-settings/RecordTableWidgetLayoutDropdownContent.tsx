import { useRecordTableWidgetViewForDisplay } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetViewForDisplay';
import { useUpdateRecordTableWidgetDisplayViewType } from '@/page-layout/widgets/record-table/hooks/useUpdateRecordTableWidgetDisplayViewType';
import { useObjectMetadataItemById } from '@/object-metadata/hooks/useObjectMetadataItemById';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponentInstanceContext';
import { SelectableList } from '@/ui/layout/selectable-list/components/SelectableList';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { selectedItemIdComponentState } from '@/ui/layout/selectable-list/states/selectedItemIdComponentState';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { ViewType, viewTypeIconMapping } from '@/views/types/ViewType';
import { useMemo } from 'react';
import { FieldMetadataType } from 'shared/types';
import { MenuItemSelect } from 'ui/navigation';

type RecordTableWidgetLayoutDropdownContentProps = {
  pageLayoutId: string;
  widgetId: string;
  viewId: string;
  objectMetadataId: string;
};

export const RecordTableWidgetLayoutDropdownContent = ({
  pageLayoutId,
  widgetId,
  viewId,
  objectMetadataId,
}: RecordTableWidgetLayoutDropdownContentProps) => {
  const dropdownId = useAvailableComponentInstanceIdOrThrow(
    DropdownComponentInstanceContext,
  );

  const selectedItemId = useAtomComponentStateValue(
    selectedItemIdComponentState,
    dropdownId,
  );

  const { objectMetadataItem } = useObjectMetadataItemById({
    objectId: objectMetadataId,
  });

  const { displayViewType } = useRecordTableWidgetViewForDisplay({
    pageLayoutId,
    widgetId,
    viewId,
  });

  const { updateRecordTableWidgetDisplayViewType } =
    useUpdateRecordTableWidgetDisplayViewType({
      pageLayoutId,
      widgetId,
      viewId,
      objectMetadataId,
    });

  const hasAddressField = useMemo(
    () =>
      objectMetadataItem.fields.some(
        (field) => field.type === FieldMetadataType.ADDRESS && field.isActive,
      ),
    [objectMetadataItem.fields],
  );

  const selectableItemIdArray = [
    ViewType.TABLE,
    ...(hasAddressField ? [ViewType.MAP] : []),
  ];

  return (
    <DropdownContent>
      <DropdownMenuItemsContainer>
        <SelectableList
          selectableListInstanceId={dropdownId}
          focusId={dropdownId}
          selectableItemIdArray={selectableItemIdArray}
        >
          <SelectableListItem
            itemId={ViewType.TABLE}
            onEnter={() =>
              updateRecordTableWidgetDisplayViewType(ViewType.TABLE)
            }
          >
            <MenuItemSelect
              LeftIcon={viewTypeIconMapping(ViewType.TABLE)}
              text={`Tabel`}
              selected={displayViewType === ViewType.TABLE}
              focused={selectedItemId === ViewType.TABLE}
              onClick={() =>
                updateRecordTableWidgetDisplayViewType(ViewType.TABLE)
              }
            />
          </SelectableListItem>
          {hasAddressField && (
            <SelectableListItem
              itemId={ViewType.MAP}
              onEnter={() =>
                updateRecordTableWidgetDisplayViewType(ViewType.MAP)
              }
            >
              <MenuItemSelect
                LeftIcon={viewTypeIconMapping(ViewType.MAP)}
                text={`Peta`}
                selected={displayViewType === ViewType.MAP}
                focused={selectedItemId === ViewType.MAP}
                onClick={() =>
                  updateRecordTableWidgetDisplayViewType(ViewType.MAP)
                }
              />
            </SelectableListItem>
          )}
        </SelectableList>
      </DropdownMenuItemsContainer>
    </DropdownContent>
  );
};

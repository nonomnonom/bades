import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { CommandMenuItemDropdown } from '@/command-menu/components/CommandMenuItemDropdown';
import { useRecordTableWidgetFieldCallbacks } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetFieldCallbacks';
import { useRecordTableWidgetViewForDisplay } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetViewForDisplay';
import { WidgetComponentInstanceContext } from '@/page-layout/widgets/states/contexts/WidgetComponentInstanceContext';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { useSidePanelSubPageHistory } from '@/side-panel/hooks/useSidePanelSubPageHistory';
import { RecordTableDataSourceDropdownContent } from '@/side-panel/pages/page-layout/components/record-table-settings/RecordTableDataSourceDropdownContent';
import { RecordTableFieldsDropdownContent } from '@/side-panel/pages/page-layout/components/record-table-settings/RecordTableFieldsDropdownContent';
import { RecordTableWidgetLayoutDropdownContent } from '@/side-panel/pages/page-layout/components/record-table-settings/RecordTableWidgetLayoutDropdownContent';
import { WidgetSettingsFooter } from '@/side-panel/pages/page-layout/components/WidgetSettingsFooter';
import { usePageLayoutIdFromContextStore } from '@/side-panel/pages/page-layout/hooks/usePageLayoutIdFromContextStore';
import { useRecordTableSettingsDescriptions } from '@/side-panel/pages/page-layout/hooks/useRecordTableSettingsDescriptions';
import { useWidgetInEditMode } from '@/side-panel/pages/page-layout/hooks/useWidgetInEditMode';
import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { styled } from '@linaria/react';
import { isDefined } from 'shared/utils';
import {
  IconArrowsSort,
  IconBox,
  IconFilter,
  IconListDetails,
  IconMap,
  IconTable,
} from 'ui/display';
import { ViewType } from '@/views/types/ViewType';
import {
  type PageLayoutWidget,
  WidgetConfigurationType,
} from '~/generated-metadata/graphql';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

type SidePanelDashboardRecordTableSettingsContentProps = {
  pageLayoutId: string;
  widgetInEditMode: PageLayoutWidget;
  viewId: string;
};

const selectableItemIds = [
  'object-view-layout',
  'record-table-source',
  'record-table-fields',
  'record-table-filter',
  'record-table-sort',
];

const SidePanelDashboardRecordTableSettingsContent = ({
  pageLayoutId,
  widgetInEditMode,
  viewId,
}: SidePanelDashboardRecordTableSettingsContentProps) => {
  const { navigateToSidePanelSubPage } = useSidePanelSubPageHistory();

  const {
    sourceDescription,
    fieldsDescription,
    filterDescription,
    sortDescription,
  } = useRecordTableSettingsDescriptions({
    objectMetadataId: widgetInEditMode.objectMetadataId,
    viewId,
  });

  const { displayViewType } = useRecordTableWidgetViewForDisplay({
    pageLayoutId,
    widgetId: widgetInEditMode.id,
    viewId,
  });

  const { handleFieldUpdated, handleFieldCreated } =
    useRecordTableWidgetFieldCallbacks({
      pageLayoutId,
      widgetId: widgetInEditMode.id,
      viewId,
    });

  const layoutDescription = displayViewType === ViewType.MAP ? `Peta` : `Tabel`;

  const handleFilterClick = () => {
    navigateToSidePanelSubPage(SidePanelSubPages.PageLayoutRecordTableFilter);
  };

  const handleSortClick = () => {
    navigateToSidePanelSubPage(SidePanelSubPages.PageLayoutRecordTableSort);
  };

  return (
    <StyledContainer>
      <WidgetComponentInstanceContext.Provider
        value={{ instanceId: widgetInEditMode.id }}
      >
        <StyledSettingsContainer>
          <SidePanelList selectableItemIds={selectableItemIds}>
            <SidePanelGroup heading={`Pengaturan`}>
              <SelectableListItem itemId="object-view-layout">
                <CommandMenuItemDropdown
                  Icon={displayViewType === ViewType.MAP ? IconMap : IconTable}
                  label={`Tata Letak`}
                  id="object-view-layout"
                  dropdownId="object-view-layout"
                  dropdownComponents={
                    isDefined(widgetInEditMode.objectMetadataId) ? (
                      <RecordTableWidgetLayoutDropdownContent
                        pageLayoutId={pageLayoutId}
                        widgetId={widgetInEditMode.id}
                        viewId={viewId}
                        objectMetadataId={widgetInEditMode.objectMetadataId}
                      />
                    ) : (
                      <DropdownContent />
                    )
                  }
                  dropdownPlacement="bottom-end"
                  hasSubMenu
                  description={layoutDescription}
                  disabled={!isDefined(widgetInEditMode.objectMetadataId)}
                  contextualTextPosition="right"
                />
              </SelectableListItem>
              <SelectableListItem itemId="record-table-source">
                <CommandMenuItemDropdown
                  Icon={IconBox}
                  label={`Sumber`}
                  id="record-table-source"
                  dropdownId="record-table-source"
                  dropdownComponents={
                    <DropdownContent>
                      <RecordTableDataSourceDropdownContent />
                    </DropdownContent>
                  }
                  dropdownPlacement="bottom-end"
                  hasSubMenu
                  description={sourceDescription}
                  contextualTextPosition="right"
                />
              </SelectableListItem>
              <SelectableListItem itemId="record-table-fields">
                <CommandMenuItemDropdown
                  Icon={IconListDetails}
                  label={`Kolom`}
                  id="record-table-fields"
                  dropdownId="record-table-fields"
                  dropdownComponents={
                    <RecordTableFieldsDropdownContent
                      viewId={viewId}
                      objectMetadataId={widgetInEditMode.objectMetadataId!}
                      onFieldUpdated={handleFieldUpdated}
                      onFieldCreated={handleFieldCreated}
                    />
                  }
                  dropdownPlacement="bottom-end"
                  hasSubMenu
                  description={fieldsDescription}
                  contextualTextPosition="right"
                />
              </SelectableListItem>
              <SelectableListItem
                itemId="record-table-filter"
                onEnter={handleFilterClick}
              >
                <CommandMenuItem
                  id="record-table-filter"
                  label={`Filter`}
                  Icon={IconFilter}
                  hasSubMenu
                  onClick={handleFilterClick}
                  description={filterDescription}
                  contextualTextPosition="right"
                />
              </SelectableListItem>
              <SelectableListItem
                itemId="record-table-sort"
                onEnter={handleSortClick}
              >
                <CommandMenuItem
                  id="record-table-sort"
                  label={`Urutkan`}
                  Icon={IconArrowsSort}
                  hasSubMenu
                  onClick={handleSortClick}
                  description={sortDescription}
                  contextualTextPosition="right"
                />
              </SelectableListItem>
            </SidePanelGroup>
          </SidePanelList>
        </StyledSettingsContainer>
        <WidgetSettingsFooter pageLayoutId={pageLayoutId} />
      </WidgetComponentInstanceContext.Provider>
    </StyledContainer>
  );
};

export const SidePanelDashboardRecordTableSettings = () => {
  const { pageLayoutId } = usePageLayoutIdFromContextStore();
  const { widgetInEditMode } = useWidgetInEditMode(pageLayoutId);

  if (!isDefined(pageLayoutId) || !isDefined(widgetInEditMode)) {
    return null;
  }

  const configuration = widgetInEditMode.configuration;
  const isRecordTableConfiguration =
    configuration?.configurationType === WidgetConfigurationType.RECORD_TABLE;

  const viewId =
    isRecordTableConfiguration &&
    isDefined(configuration) &&
    'viewId' in configuration &&
    isDefined(configuration.viewId)
      ? configuration.viewId
      : null;

  if (!isDefined(viewId)) {
    return null;
  }

  return (
    <SidePanelDashboardRecordTableSettingsContent
      pageLayoutId={pageLayoutId}
      widgetInEditMode={widgetInEditMode}
      viewId={viewId}
    />
  );
};

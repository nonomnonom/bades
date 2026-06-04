import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { useUpdateSidePanelPageInfo } from '@/side-panel/hooks/useUpdateSidePanelPageInfo';
import { ChartSettingItem } from '@/side-panel/pages/page-layout/components/chart-settings/ChartSettingItem';
import { ChartLimitInfoBanner } from '@/side-panel/pages/page-layout/components/ChartLimitInfoBanner';
import { ChartTypeSelectionSection } from '@/side-panel/pages/page-layout/components/ChartTypeSelectionSection';
import { CHART_SETTINGS_HEADINGS } from '@/side-panel/pages/page-layout/constants/ChartSettingsHeadings';
import { CHART_DATA_SOURCE_SETTING } from '@/side-panel/pages/page-layout/constants/settings/ChartDataSourceSetting';
import { GRAPH_TYPE_INFORMATION } from '@/side-panel/pages/page-layout/constants/GraphTypeInformation';
import { useChartSettingsValues } from '@/side-panel/pages/page-layout/hooks/useChartSettingsValues';
import { usePageLayoutIdFromContextStore } from '@/side-panel/pages/page-layout/hooks/usePageLayoutIdFromContextStore';
import { useUpdateCurrentWidgetConfig } from '@/side-panel/pages/page-layout/hooks/useUpdateCurrentWidgetConfig';
import { useGetConfigToUpdateAfterGraphTypeChange } from '@/side-panel/pages/page-layout/hooks/useUpdateGraphTypeConfig';
import { CHART_CONFIGURATION_SETTING_IDS } from '@/side-panel/pages/page-layout/types/ChartConfigurationSettingIds';
import { shouldHideChartSetting } from '@/side-panel/pages/page-layout/utils/shouldHideChartSetting';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { hasWidgetTooManyGroupsComponentState } from '@/page-layout/widgets/graph/states/hasWidgetTooManyGroupsComponentState';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { isFieldMetadataDateKind } from 'shared/utils';

import { GraphType } from '@/side-panel/pages/page-layout/types/GraphType';
import { getCurrentGraphTypeFromConfig } from '@/side-panel/pages/page-layout/utils/getCurrentGraphTypeFromConfig';
import { isChartWidget } from '@/side-panel/pages/page-layout/utils/isChartWidget';
import { isWidgetConfigurationOfType } from '@/side-panel/pages/page-layout/utils/isWidgetConfigurationOfType';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';

const StyledSidePanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const ChartSettings = ({ widget }: { widget: PageLayoutWidget }) => {
  const { updateSidePanelPageInfo } = useUpdateSidePanelPageInfo();
  const { pageLayoutId } = usePageLayoutIdFromContextStore();
  const { updateCurrentWidgetConfig } =
    useUpdateCurrentWidgetConfig(pageLayoutId);
  const { objectMetadataItems } = useObjectMetadataItems();

  if (!isChartWidget(widget) || !widget.configuration) {
    return null;
  }

  const configuration = widget.configuration;
  const objectMetadataId = isNonEmptyString(widget.objectMetadataId)
    ? widget.objectMetadataId
    : null;

  const { getChartSettingsValues } = useChartSettingsValues({
    objectMetadataId: objectMetadataId ?? '',
    configuration,
  });

  const { getConfigToUpdateAfterGraphTypeChange } =
    useGetConfigToUpdateAfterGraphTypeChange({
      pageLayoutId,
      widget,
    });

  const isGroupByEnabled = getChartSettingsValues(
    CHART_CONFIGURATION_SETTING_IDS.GROUP_BY,
  );
  const [hasWidgetTooManyGroups, setHasWidgetTooManyGroups] =
    useAtomComponentState(hasWidgetTooManyGroupsComponentState);

  const handleGraphTypeChange = (graphType: GraphType) => {
    const configToUpdate = getConfigToUpdateAfterGraphTypeChange(graphType);

    updateCurrentWidgetConfig({
      configToUpdate,
    });

    updateSidePanelPageInfo({
      pageIcon: GRAPH_TYPE_INFORMATION[graphType].icon,
    });

    if (
      graphType !== GraphType.VERTICAL_BAR &&
      graphType !== GraphType.HORIZONTAL_BAR &&
      graphType !== GraphType.LINE
    ) {
      setHasWidgetTooManyGroups(false);
    }
  };

  const currentGraphType = getCurrentGraphTypeFromConfig(configuration);

  const chartSettings = GRAPH_TYPE_INFORMATION[currentGraphType].settings;

  const bannerTargetHeading =
    currentGraphType === GraphType.PIE
      ? CHART_SETTINGS_HEADINGS.DATA
      : CHART_SETTINGS_HEADINGS.X_AXIS;

  if (!objectMetadataId) {
    return (
      <StyledSidePanelContainer>
        <SidePanelList
          selectableItemIds={[CHART_CONFIGURATION_SETTING_IDS.SOURCE]}
        >
          <ChartTypeSelectionSection
            currentGraphType={currentGraphType}
            setCurrentGraphType={handleGraphTypeChange}
          />
          <SidePanelGroup heading={CHART_SETTINGS_HEADINGS.DATA}>
            <ChartSettingItem
              item={CHART_DATA_SOURCE_SETTING}
              objectMetadataId=""
              configuration={configuration}
            />
          </SidePanelGroup>
        </SidePanelList>
      </StyledSidePanelContainer>
    );
  }

  const objectMetadataItem = objectMetadataItems.find(
    (item) => item.id === objectMetadataId,
  );

  const visibleItemIds = chartSettings.flatMap((group) =>
    group.items
      .filter(
        (item) =>
          !shouldHideChartSetting(
            item,
            objectMetadataId,
            isGroupByEnabled as boolean,
            configuration,
            objectMetadataItem,
            objectMetadataItems,
          ),
      )
      .map((item) => item.id),
  );

  const isBarOrLineChart =
    isWidgetConfigurationOfType(configuration, 'BarChartConfiguration') ||
    isWidgetConfigurationOfType(configuration, 'LineChartConfiguration');

  const isPieChart = isWidgetConfigurationOfType(
    configuration,
    'PieChartConfiguration',
  );

  const primaryAxisFieldMetadataId = isBarOrLineChart
    ? configuration.primaryAxisGroupByFieldMetadataId
    : isPieChart
      ? configuration.groupByFieldMetadataId
      : null;

  const primaryAxisField = objectMetadataItem?.fields?.find(
    (field) => field.id === primaryAxisFieldMetadataId,
  );

  const isPrimaryAxisDate = isFieldMetadataDateKind(primaryAxisField?.type);

  const primaryAxisDateGranularity = isBarOrLineChart
    ? configuration.primaryAxisDateGranularity
    : isPieChart
      ? configuration.dateGranularity
      : null;

  return (
    <StyledSidePanelContainer>
      <SidePanelList selectableItemIds={visibleItemIds}>
        <ChartTypeSelectionSection
          currentGraphType={currentGraphType}
          setCurrentGraphType={handleGraphTypeChange}
        />
        {chartSettings.map((group) => {
          const visibleItems = group.items.filter(
            (item) =>
              !shouldHideChartSetting(
                item,
                objectMetadataId,
                isGroupByEnabled as boolean,
                configuration,
                objectMetadataItem,
                objectMetadataItems,
              ),
          );

          const shouldShowBanner = group.heading === bannerTargetHeading;

          return (
            <SidePanelGroup key={group.heading} heading={group.heading}>
              {shouldShowBanner && hasWidgetTooManyGroups && (
                <ChartLimitInfoBanner
                  widgetConfigurationType={configuration.configurationType}
                  isPrimaryAxisDate={isPrimaryAxisDate}
                  primaryAxisDateGranularity={primaryAxisDateGranularity}
                />
              )}
              {visibleItems.map((item) => (
                <ChartSettingItem
                  key={item.id}
                  item={item}
                  objectMetadataId={objectMetadataId}
                  configuration={configuration}
                />
              ))}
            </SidePanelGroup>
          );
        })}
      </SidePanelList>
    </StyledSidePanelContainer>
  );
};

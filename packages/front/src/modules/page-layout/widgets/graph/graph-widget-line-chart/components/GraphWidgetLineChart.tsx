import { CHART_MOTION_CONFIG } from '@/page-layout/widgets/graph/constants/ChartMotionConfig';
import { GraphWidgetChartContainer } from '@/page-layout/widgets/graph/components/GraphWidgetChartContainer';
import { GraphWidgetLegend } from '@/page-layout/widgets/graph/components/GraphWidgetLegend';
import { NoDataLayer } from '@/page-layout/widgets/graph/components/NoDataLayer';
import {
  CustomCrosshairLayer,
  type SliceHoverData,
} from '@/page-layout/widgets/graph/graph-widget-line-chart/components/CustomCrosshairLayer';
import { CustomLinesLayer } from '@/page-layout/widgets/graph/graph-widget-line-chart/components/CustomLinesLayer';
import { CustomPointLabelsLayer } from '@/page-layout/widgets/graph/graph-widget-line-chart/components/CustomPointLabelsLayer';
import { CustomStackedAreasLayer } from '@/page-layout/widgets/graph/graph-widget-line-chart/components/CustomStackedAreasLayer';
import { GraphLineChartTooltip } from '@/page-layout/widgets/graph/graph-widget-line-chart/components/GraphLineChartTooltip';
import { useLineChartData } from '@/page-layout/widgets/graph/graph-widget-line-chart/hooks/useLineChartData';
import { useLineChartTheme } from '@/page-layout/widgets/graph/graph-widget-line-chart/hooks/useLineChartTheme';
import { graphWidgetLineCrosshairXComponentState } from '@/page-layout/widgets/graph/graph-widget-line-chart/states/graphWidgetLineCrosshairXComponentState';
import { graphWidgetLineTooltipComponentState } from '@/page-layout/widgets/graph/graph-widget-line-chart/states/graphWidgetLineTooltipComponentState';
import { type LineChartSeriesWithColor } from '@/page-layout/widgets/graph/graph-widget-line-chart/types/LineChartSeriesWithColor';
import { calculateValueRangeFromLineChartSeries } from '@/page-layout/widgets/graph/graph-widget-line-chart/utils/calculateValueRangeFromLineChartSeries';
import { getLineChartLayout } from '@/page-layout/widgets/graph/graph-widget-line-chart/utils/getLineChartLayout';
import { type GraphColorMode } from '@/page-layout/widgets/graph/types/GraphColorMode';
import { computeEffectiveValueRange } from '@/page-layout/widgets/graph/utils/computeEffectiveValueRange';
import { createGraphColorRegistry } from '@/page-layout/widgets/graph/utils/createGraphColorRegistry';
import {
  formatGraphValue,
  type GraphValueFormatOptions,
} from '@/page-layout/widgets/graph/utils/graphFormatters';
import { NodeDimensionEffect } from '@/ui/utilities/dimensions/components/NodeDimensionEffect';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import {
  ResponsiveLine,
  type LineCustomSvgLayerProps,
  type LineSeries,
  type Point,
  type SliceTooltipProps,
} from '@nivo/line';
import { useCallback, useContext, useRef, useState } from 'react';

import { isDefined } from 'shared/utils';
import { ThemeContext } from 'ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';

type GraphWidgetLineChartProps = {
  data: LineChartSeriesWithColor[];
  showLegend?: boolean;
  showGrid?: boolean;
  enablePointLabel?: boolean;
  xAxisLabel?: string;
  enableArea?: boolean;
  yAxisLabel?: string;
  id: string;
  rangeMin?: number;
  rangeMax?: number;
  omitNullValues?: boolean;
  groupMode?: 'stacked';
  colorMode: GraphColorMode;
  onSliceClick?: (point: Point<LineSeries>) => void;
} & GraphValueFormatOptions;

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

type PointLabelsLayerProps = LineCustomSvgLayerProps<LineSeries> & {
  hasNoData: boolean;
  formatOptions: GraphValueFormatOptions;
  groupMode?: 'stacked';
  omitNullValues: boolean;
  enablePointLabel: boolean;
};

const PointLabelsLayer = ({
  hasNoData,
  formatOptions,
  groupMode,
  omitNullValues,
  enablePointLabel,
  ...layerProps
}: PointLabelsLayerProps) => {
  if (hasNoData) {
    return null;
  }

  return (
    <CustomPointLabelsLayer
      points={layerProps.points}
      formatValue={(value) => formatGraphValue(value, formatOptions)}
      offset={8}
      groupMode={groupMode}
      omitNullValues={omitNullValues}
      enablePointLabel={enablePointLabel}
    />
  );
};

type CrosshairLayerProps = LineCustomSvgLayerProps<LineSeries> & {
  hasNoData: boolean;
  margins: ReturnType<typeof getLineChartLayout>['margins'];
  onSliceHover: (sliceData: SliceHoverData) => void;
  onSliceClick?: (point: Point<LineSeries>) => void;
  onRectLeave: () => void;
};

const CrosshairLayer = ({
  hasNoData,
  margins,
  onSliceHover,
  onSliceClick,
  onRectLeave,
  ...layerProps
}: CrosshairLayerProps) => {
  if (hasNoData) {
    return null;
  }

  return (
    <CustomCrosshairLayer
      key="custom-crosshair-layer"
      points={layerProps.points}
      innerHeight={layerProps.innerHeight}
      innerWidth={layerProps.innerWidth}
      marginLeft={margins.left}
      marginTop={margins.top}
      onSliceHover={onSliceHover}
      onSliceClick={
        isDefined(onSliceClick)
          ? (sliceData) => onSliceClick(sliceData.closestPoint)
          : undefined
      }
      onRectLeave={onRectLeave}
    />
  );
};

type StackedAreasLayerProps = LineCustomSvgLayerProps<LineSeries> & {
  hasNoData: boolean;
  enrichedSeries: ReturnType<typeof useLineChartData>['enrichedSeries'];
  enableArea: boolean;
  isStacked: boolean;
};

const StackedAreasLayer = ({
  hasNoData,
  enrichedSeries,
  enableArea,
  isStacked,
  ...layerProps
}: StackedAreasLayerProps) => {
  if (hasNoData) {
    return null;
  }

  return (
    <CustomStackedAreasLayer
      series={layerProps.series}
      innerHeight={layerProps.innerHeight}
      enrichedSeries={enrichedSeries}
      enableArea={enableArea}
      yScale={layerProps.yScale}
      isStacked={isStacked}
    />
  );
};

type LinesLayerProps = LineCustomSvgLayerProps<LineSeries> & {
  hasNoData: boolean;
};

const LinesLayer = ({ hasNoData, ...layerProps }: LinesLayerProps) => {
  if (hasNoData) {
    return null;
  }

  return (
    <CustomLinesLayer
      series={layerProps.series}
      lineGenerator={layerProps.lineGenerator}
      lineWidth={layerProps.lineWidth}
    />
  );
};

type NoDataLayerWrapperProps = LineCustomSvgLayerProps<LineSeries> & {
  hasNoData: boolean;
};

const NoDataLayerWrapper = ({
  hasNoData,
  ...layerProps
}: NoDataLayerWrapperProps) => (
  <NoDataLayer
    innerWidth={layerProps.innerWidth}
    innerHeight={layerProps.innerHeight}
    hasNoData={hasNoData}
  />
);

export const GraphWidgetLineChart = ({
  data,
  showLegend = true,
  showGrid = true,
  enableArea = true,
  enablePointLabel = false,
  xAxisLabel,
  yAxisLabel,
  id,
  rangeMin,
  rangeMax,
  omitNullValues = false,
  displayType,
  groupMode,
  colorMode,
  decimals,
  prefix,
  suffix,
  customFormatter,
  onSliceClick,
}: GraphWidgetLineChartProps) => {
  const { theme } = useContext(ThemeContext);
  const colorRegistry = createGraphColorRegistry(theme.color);
  const chartTheme = useLineChartTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const formatOptions: GraphValueFormatOptions = {
    displayType,
    decimals,
    prefix,
    suffix,
    customFormatter,
  };

  const { enrichedSeries, nivoData, colors, legendItems, visibleData } =
    useLineChartData({
      data,
      colorRegistry,
      id,
      colorMode,
    });

  const calculatedValueRange =
    calculateValueRangeFromLineChartSeries(visibleData);

  const hasNoData =
    visibleData.length === 0 ||
    visibleData.every((series) => series.data.length === 0);

  const { effectiveMinimumValue, effectiveMaximumValue } =
    computeEffectiveValueRange({
      calculatedMinimum: calculatedValueRange.minimum,
      calculatedMaximum: calculatedValueRange.maximum,
      rangeMin,
      rangeMax,
    });

  const hasClickableItems = isDefined(onSliceClick);

  const setGraphWidgetLineTooltip = useSetAtomComponentState(
    graphWidgetLineTooltipComponentState,
  );

  const setGraphWidgetLineCrosshairX = useSetAtomComponentState(
    graphWidgetLineCrosshairXComponentState,
  );

  const hideTooltip = useCallback(() => {
    setGraphWidgetLineTooltip(null);
    setGraphWidgetLineCrosshairX(null);
  }, [setGraphWidgetLineTooltip, setGraphWidgetLineCrosshairX]);

  const debouncedHideTooltip = useDebouncedCallback(hideTooltip, 300);

  const handleTooltipMouseEnter = () => {
    debouncedHideTooltip.cancel();
  };

  const handleTooltipMouseLeave = debouncedHideTooltip;

  const handleSliceLeave = () => {
    debouncedHideTooltip();
  };

  const {
    margins,
    axisBottomConfiguration,
    axisLeftConfiguration,
    valueTickValues,
    valueDomain,
  } = getLineChartLayout({
    axisTheme: chartTheme.axis,
    chartWidth,
    data,
    xAxisLabel,
    yAxisLabel,
    formatOptions,
    effectiveMinimumValue,
    effectiveMaximumValue,
  });

  const handleSliceEnter = (sliceData: SliceHoverData) => {
    const slice: SliceTooltipProps<LineSeries>['slice'] = {
      id: String(sliceData.nearestSlice.xValue ?? ''),
      x: sliceData.nearestSlice.x,
      y: sliceData.mouseY,
      x0: sliceData.nearestSlice.x,
      y0: 0,
      width: 0,
      height: 0,
      points: sliceData.nearestSlice.points,
    };

    const offsetLeft = sliceData.nearestSlice.x + margins.left;
    const offsetTop = sliceData.mouseY + margins.top;

    debouncedHideTooltip.cancel();
    setGraphWidgetLineCrosshairX(sliceData.sliceX);
    setGraphWidgetLineTooltip({
      slice,
      offsetLeft,
      offsetTop,
      highlightedSeriesId: String(sliceData.closestPoint.seriesId),
    });
  };

  return (
    <StyledContainer id={id}>
      <GraphWidgetChartContainer
        $isClickable={hasClickableItems}
        onMouseLeave={() => debouncedHideTooltip()}
        ref={containerRef}
      >
        <NodeDimensionEffect
          elementRef={containerRef}
          onDimensionChange={({ width }) => setChartWidth(width)}
        />
        <ResponsiveLine
          data={nivoData}
          margin={{
            top: margins.top,
            right: margins.right,
            bottom: margins.bottom,
            left: margins.left,
          }}
          animate
          motionConfig={CHART_MOTION_CONFIG}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: valueDomain.min,
            max: valueDomain.max,
            stacked: groupMode === 'stacked',
            clamp: true,
          }}
          curve={'monotoneX'}
          lineWidth={1}
          enablePoints={true}
          pointSize={0}
          enablePointLabel={false}
          pointBorderWidth={0}
          colors={colors}
          axisTop={null}
          axisRight={null}
          axisBottom={axisBottomConfiguration}
          axisLeft={axisLeftConfiguration}
          enableGridX={showGrid}
          enableGridY={showGrid}
          gridYValues={valueTickValues}
          enableSlices={'x'}
          sliceTooltip={() => null}
          tooltip={() => null}
          layers={[
            'grid',
            'markers',
            'axes',
            (layerProps) => (
              <StackedAreasLayer
                // oxlint-disable-next-line react/jsx-props-no-spreading
                {...layerProps}
                hasNoData={hasNoData}
                enrichedSeries={enrichedSeries}
                enableArea={enableArea}
                isStacked={groupMode === 'stacked'}
              />
            ),
            (layerProps) => (
              <LinesLayer
                // oxlint-disable-next-line react/jsx-props-no-spreading
                {...layerProps}
                hasNoData={hasNoData}
              />
            ),
            (layerProps) => (
              <CrosshairLayer
                // oxlint-disable-next-line react/jsx-props-no-spreading
                {...layerProps}
                hasNoData={hasNoData}
                margins={margins}
                onSliceHover={handleSliceEnter}
                onSliceClick={onSliceClick}
                onRectLeave={handleSliceLeave}
              />
            ),
            'points',
            (layerProps) => (
              <PointLabelsLayer
                // oxlint-disable-next-line react/jsx-props-no-spreading
                {...layerProps}
                hasNoData={hasNoData}
                formatOptions={formatOptions}
                groupMode={groupMode}
                omitNullValues={omitNullValues}
                enablePointLabel={enablePointLabel}
              />
            ),
            'legends',
            (layerProps) => (
              <NoDataLayerWrapper
                // oxlint-disable-next-line react/jsx-props-no-spreading
                {...layerProps}
                hasNoData={hasNoData}
              />
            ),
          ]}
          theme={chartTheme}
        />
      </GraphWidgetChartContainer>
      <GraphLineChartTooltip
        containerRef={containerRef}
        enrichedSeries={enrichedSeries}
        formatOptions={formatOptions}
        isStacked={groupMode === 'stacked'}
        onSliceClick={onSliceClick}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      />
      {showLegend && data.length > 0 && (
        <GraphWidgetLegend show items={legendItems} />
      )}
    </StyledContainer>
  );
};

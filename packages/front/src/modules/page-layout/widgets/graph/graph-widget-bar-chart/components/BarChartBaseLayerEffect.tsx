import { CHART_CORE_CONSTANTS } from '@/page-layout/widgets/graph/chart-core/constants/ChartCoreConstants';
import { computeValueScale } from '@/page-layout/widgets/graph/chart-core/utils/computeValueScale';
import { renderGridLayer } from '@/page-layout/widgets/graph/chart-core/utils/renderGridLayer';
import { BAR_CHART_CONSTANTS } from '@/page-layout/widgets/graph/graph-widget-bar-chart/constants/BarChartConstants';
import { type BarPosition } from '@/page-layout/widgets/graph/graph-widget-bar-chart/types/BarPosition';
import { computeBaselineBar } from '@/page-layout/widgets/graph/graph-widget-bar-chart/utils/computeBaselineBar';
import { interpolateBars } from '@/page-layout/widgets/graph/graph-widget-bar-chart/utils/interpolateBars';
import { renderBars } from '@/page-layout/widgets/graph/graph-widget-bar-chart/utils/renderBars';
import { type ChartMargins } from '@/page-layout/widgets/graph/types/ChartMargins';
import {
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { BarChartLayout } from '~/generated-metadata/graphql';
import { ThemeContext } from 'ui/theme-constants';

type BarChartBaseLayerEffectProps = {
  bars: BarPosition[];
  chartWidth: number;
  chartHeight: number;
  margins: ChartMargins;
  layout: BarChartLayout;
  valueDomain: { min: number; max: number };
  valueTickValues: number[];
  showGrid: boolean;
  highlightedLegendId: string | null;
  allowDataTransitions: boolean;
  canvasRef: RefObject<HTMLCanvasElement>;
};

type AnimationState = {
  sourceBars: BarPosition[];
  targetBars: BarPosition[];
  startTime: number;
  isAnimating: boolean;
};

export const BarChartBaseLayerEffect = ({
  bars,
  chartWidth,
  chartHeight,
  margins,
  layout,
  valueDomain,
  valueTickValues,
  showGrid,
  highlightedLegendId,
  allowDataTransitions,
  canvasRef,
}: BarChartBaseLayerEffectProps) => {
  const { theme } = useContext(ThemeContext);

  const borderRadius = parseInt(theme.border.radius.sm);
  const gridColor = theme.border.color.light;
  const isVertical = layout === BarChartLayout.VERTICAL;
  const durationMs =
    theme.animation.duration.normal *
    CHART_CORE_CONSTANTS.MILLISECONDS_PER_SECOND;

  const dprRef = useRef<number>(
    (typeof window !== 'undefined' ? window.devicePixelRatio : undefined) ||
      CHART_CORE_CONSTANTS.DEFAULT_DEVICE_PIXEL_RATIO,
  );
  const chartSizeRef = useRef({ width: chartWidth, height: chartHeight });
  const animationStateRef = useRef<AnimationState>({
    sourceBars: bars,
    targetBars: bars,
    startTime: performance.now(),
    isAnimating: false,
  });

  const innerWidth = chartWidth - margins.left - margins.right;
  const innerHeight = chartHeight - margins.top - margins.bottom;
  const axisLength = isVertical ? innerHeight : innerWidth;
  const { valueToPixel } = computeValueScale({
    domain: valueDomain,
    axisLength,
  });
  const zeroPixel = valueToPixel(0);

  const toBaselineBar = useCallback(
    (bar: BarPosition): BarPosition =>
      computeBaselineBar({ bar, innerHeight, zeroPixel, isVertical }),
    [innerHeight, zeroPixel, isVertical],
  );

  useEffect(() => {
    const sizeIsStable =
      chartSizeRef.current.width === chartWidth && chartSizeRef.current.height === chartHeight;

    if (!sizeIsStable) {
      chartSizeRef.current = { width: chartWidth, height: chartHeight };
      animationStateRef.current = {
        sourceBars: bars,
        targetBars: bars,
        startTime: performance.now(),
        isAnimating: false,
      };
      return;
    }

    if (!allowDataTransitions) {
      animationStateRef.current = {
        sourceBars: bars,
        targetBars: bars,
        startTime: performance.now(),
        isAnimating: false,
      };
      return;
    }

    const prev = animationStateRef.current;
    const now = performance.now();

    if (prev.targetBars === bars) {
      return;
    }

    if (bars.length === 0 && prev.targetBars.length === 0) {
      animationStateRef.current = {
        sourceBars: bars,
        targetBars: bars,
        startTime: now,
        isAnimating: false,
      };
      return;
    }

    const sourceBars = prev.isAnimating
      ? interpolateBars(
          prev.sourceBars,
          prev.targetBars,
          Math.min((now - prev.startTime) / durationMs, 1),
          toBaselineBar,
        )
      : prev.targetBars;

    animationStateRef.current = {
      sourceBars,
      targetBars: bars,
      startTime: now,
      isAnimating: true,
    };
  }, [
    allowDataTransitions,
    bars,
    chartHeight,
    chartWidth,
    durationMs,
    toBaselineBar,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (chartWidth <= 0 || chartHeight <= 0) {
      return;
    }

    canvas.width = chartWidth * dprRef.current;
    canvas.height = chartHeight * dprRef.current;
    canvas.style.width = `${chartWidth}px`;
    canvas.style.height = `${chartHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

    const render = (barsToRender: BarPosition[]) => {
      const innerW = chartWidth - margins.left - margins.right;
      const innerH = chartHeight - margins.top - margins.bottom;

      ctx.clearRect(0, 0, chartWidth, chartHeight);
      ctx.save();
      ctx.translate(margins.left, margins.top);

      if (showGrid) {
        renderGridLayer({
          ctx,
          innerWidth: innerW,
          innerHeight: innerH,
          valueTickValues,
          valueDomain,
          isVertical,
          gridColor,
          lineWidth: BAR_CHART_CONSTANTS.GRID_LINE_WIDTH,
          dashLength: BAR_CHART_CONSTANTS.GRID_DASH_LENGTH,
          dashGap: BAR_CHART_CONSTANTS.GRID_DASH_GAP,
        });
      }

      renderBars({
        ctx,
        bars: barsToRender,
        borderRadius,
        isVertical,
        highlightedLegendId,
      });

      ctx.restore();
    };

    const animState = animationStateRef.current;

    if (
      !animState.isAnimating ||
      animState.sourceBars === animState.targetBars
    ) {
      render(animState.targetBars);
      return;
    }

    let frameId = 0;

    const drawFrame = () => {
      const elapsed = performance.now() - animState.startTime;
      const t = Math.min(elapsed / durationMs, 1);

      if (t >= 1) {
        render(animState.targetBars);
        return;
      }

      const interpolatedBars = interpolateBars(
        animState.sourceBars,
        animState.targetBars,
        t,
        toBaselineBar,
      );

      render(interpolatedBars);

      frameId = requestAnimationFrame(drawFrame);
    };

    frameId = requestAnimationFrame(drawFrame);

    return () => cancelAnimationFrame(frameId);
  }, [
    animationStateRef,
    borderRadius,
    chartHeight,
    chartWidth,
    durationMs,
    gridColor,
    highlightedLegendId,
    isVertical,
    margins.bottom,
    margins.left,
    margins.right,
    margins.top,
    showGrid,
    toBaselineBar,
    valueDomain,
    valueTickValues,
    canvasRef,
  ]);

  return null;
};

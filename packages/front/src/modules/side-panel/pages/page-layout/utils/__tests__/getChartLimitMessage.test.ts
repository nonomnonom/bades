import { getChartLimitMessage } from '@/side-panel/pages/page-layout/utils/getChartLimitMessage';
import { ObjectRecordGroupByDateGranularity } from 'shared/types';
import { WidgetConfigurationType } from '~/generated-metadata/graphql';

describe('getChartLimitMessage', () => {
  it('returns date-based message for bar chart with date axis', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.BAR_CHART,
      isPrimaryAxisDate: true,
      primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
    });

    expect(result).toContain('Data tidak ditampilkan');
    expect(result).toContain('hari');
    expect(result).toContain('per grafik');
  });

  it('returns bars message for bar chart without date axis', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.BAR_CHART,
      isPrimaryAxisDate: false,
      primaryAxisDateGranularity: null,
    });

    expect(result).toContain('batang per grafik');
  });

  it('returns data points message for line chart without date axis', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.LINE_CHART,
      isPrimaryAxisDate: false,
      primaryAxisDateGranularity: null,
    });

    expect(result).toContain('titik data per grafik');
  });

  it('returns slices message for pie chart', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.PIE_CHART,
      isPrimaryAxisDate: false,
      primaryAxisDateGranularity: null,
    });

    expect(result).toContain('irisan per grafik');
  });

  it('returns date-based message with weeks granularity', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.LINE_CHART,
      isPrimaryAxisDate: true,
      primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.WEEK,
    });

    expect(result).toContain('minggu');
  });

  it('returns slices message when isPrimaryAxisDate is true but granularity is null', () => {
    const result = getChartLimitMessage({
      widgetConfigurationType: WidgetConfigurationType.PIE_CHART,
      isPrimaryAxisDate: true,
      primaryAxisDateGranularity: null,
    });

    expect(result).toContain('irisan per grafik');
  });
});

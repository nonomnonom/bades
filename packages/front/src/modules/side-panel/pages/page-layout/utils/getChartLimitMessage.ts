import { getDateGranularityPluralLabel } from '@/side-panel/pages/page-layout/utils/getDateGranularityPluralLabel';
import { BAR_CHART_CONSTANTS } from '@/page-layout/widgets/graph/graph-widget-bar-chart/constants/BarChartConstants';
import { LINE_CHART_CONSTANTS } from '@/page-layout/widgets/graph/graph-widget-line-chart/constants/LineChartConstants';
import { PIE_CHART_MAXIMUM_NUMBER_OF_SLICES } from '@/page-layout/widgets/graph/graph-widget-pie-chart/constants/PieChartMaximumNumberOfSlices.constant';
import { t } from '~/utils/i18n/badesI18n';
import { type ObjectRecordGroupByDateGranularity } from 'shared/types';
import { isDefined } from 'shared/utils';
import { WidgetConfigurationType } from '~/generated-metadata/graphql';

type GetChartLimitMessageParams = {
  widgetConfigurationType: WidgetConfigurationType;
  isPrimaryAxisDate: boolean;
  primaryAxisDateGranularity:
    | ObjectRecordGroupByDateGranularity
    | null
    | undefined;
};

export const getChartLimitMessage = ({
  widgetConfigurationType,
  isPrimaryAxisDate,
  primaryAxisDateGranularity,
}: GetChartLimitMessageParams): string => {
  const maxItems =
    widgetConfigurationType === WidgetConfigurationType.LINE_CHART
      ? LINE_CHART_CONSTANTS.MAXIMUM_NUMBER_OF_DATA_POINTS
      : widgetConfigurationType === WidgetConfigurationType.BAR_CHART
        ? BAR_CHART_CONSTANTS.MAXIMUM_NUMBER_OF_BARS
        : PIE_CHART_MAXIMUM_NUMBER_OF_SLICES;

  if (isPrimaryAxisDate && isDefined(primaryAxisDateGranularity)) {
    const granularityLabel = getDateGranularityPluralLabel(
      primaryAxisDateGranularity,
    );
    return t`Data tidak ditampilkan: maks ${maxItems} ${granularityLabel} per grafik.`;
  }

  if (widgetConfigurationType === WidgetConfigurationType.LINE_CHART) {
    return t`Data tidak ditampilkan: maks ${maxItems} titik data per grafik.`;
  }

  if (widgetConfigurationType === WidgetConfigurationType.BAR_CHART) {
    return t`Data tidak ditampilkan: maks ${maxItems} batang per grafik.`;
  }

  return t`Data tidak ditampilkan: maks ${maxItems} irisan per grafik.`;
};

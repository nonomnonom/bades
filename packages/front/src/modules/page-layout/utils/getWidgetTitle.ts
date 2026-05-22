import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'shared/utils';
import {
  BarChartLayout,
  WidgetConfigurationType,
  type WidgetConfiguration,
} from '~/generated-metadata/graphql';

export const getWidgetTitle = (
  configuration: Pick<WidgetConfiguration, 'configurationType'> & {
    layout?: BarChartLayout;
  },
  index: number,
): string => {
  switch (configuration.configurationType) {
    case WidgetConfigurationType.AGGREGATE_CHART:
      return `${t`Grafik Agregat`} ${index + 1}`;
    case WidgetConfigurationType.GAUGE_CHART:
      return `${t`Grafik Gauge`} ${index + 1}`;
    case WidgetConfigurationType.PIE_CHART:
      return `${t`Grafik Lingkaran`} ${index + 1}`;
    case WidgetConfigurationType.BAR_CHART:
      if (configuration.layout === BarChartLayout.VERTICAL) {
        return `${t`Grafik Batang Vertikal`} ${index + 1}`;
      } else {
        return `${t`Grafik Batang Horizontal`} ${index + 1}`;
      }
    case WidgetConfigurationType.LINE_CHART:
      return `${t`Grafik Garis`} ${index + 1}`;
    case WidgetConfigurationType.IFRAME:
      return `${t`Iframe`} ${index + 1}`;
    case WidgetConfigurationType.STANDALONE_RICH_TEXT:
      return `${t`Teks Kaya`} ${index + 1}`;
    case WidgetConfigurationType.FIELD:
    case WidgetConfigurationType.FIELDS:
    case WidgetConfigurationType.CALENDAR:
    case WidgetConfigurationType.EMAILS:
    case WidgetConfigurationType.TASKS:
    case WidgetConfigurationType.NOTES:
    case WidgetConfigurationType.FILES:
    case WidgetConfigurationType.WORKFLOW:
    case WidgetConfigurationType.WORKFLOW_VERSION:
    case WidgetConfigurationType.WORKFLOW_RUN:
    case WidgetConfigurationType.VIEW:
    case WidgetConfigurationType.TIMELINE:
    case WidgetConfigurationType.FIELD_RICH_TEXT:
    default:
      assertUnreachable(configuration.configurationType as never);
  }
};

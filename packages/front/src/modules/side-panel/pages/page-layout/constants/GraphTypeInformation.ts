import { AGGREGATE_CHART_SETTINGS } from '@/side-panel/pages/page-layout/constants/AggregateChartSettings';
import { GAUGE_CHART_SETTINGS } from '@/side-panel/pages/page-layout/constants/GaugeChartSettings';
import { LINE_CHART_SETTINGS } from '@/side-panel/pages/page-layout/constants/LineChartSettings';
import { PIE_CHART_SETTINGS } from '@/side-panel/pages/page-layout/constants/PieChartSettings';
import { type ChartSettingsGroup } from '@/side-panel/pages/page-layout/types/ChartSettingsGroup';
import { GraphType } from '@/side-panel/pages/page-layout/types/GraphType';
import { getBarChartSettings } from '@/side-panel/pages/page-layout/utils/getBarChartSettings';
import { msg } from '~/utils/i18n/badesI18n';
import {
  IconChartBar,
  IconChartBarHorizontal,
  IconChartLine,
  IconChartPie,
  type IconComponent,
  IconGauge,
  IconSum,
} from 'ui/display';
import { BarChartLayout } from '~/generated-metadata/graphql';

export const GRAPH_TYPE_INFORMATION: Record<
  GraphType,
  {
    label: string;
    icon: IconComponent;
    settings: ChartSettingsGroup[];
  }
> = {
  [GraphType.VERTICAL_BAR]: {
    label: msg`Grafik Batang Vertikal`,
    icon: IconChartBar,
    settings: getBarChartSettings(BarChartLayout.VERTICAL),
  },
  [GraphType.HORIZONTAL_BAR]: {
    label: msg`Grafik Batang Horizontal`,
    icon: IconChartBarHorizontal,
    settings: getBarChartSettings(BarChartLayout.HORIZONTAL),
  },
  [GraphType.PIE]: {
    label: msg`Grafik Lingkaran`,
    icon: IconChartPie,
    settings: PIE_CHART_SETTINGS,
  },
  [GraphType.LINE]: {
    label: msg`Grafik Garis`,
    icon: IconChartLine,
    settings: LINE_CHART_SETTINGS,
  },
  [GraphType.AGGREGATE]: {
    label: msg`Grafik Agregat`,
    icon: IconSum,
    settings: AGGREGATE_CHART_SETTINGS,
  },
  [GraphType.GAUGE]: {
    label: msg`Grafik Pengukur`,
    icon: IconGauge,
    settings: GAUGE_CHART_SETTINGS,
  },
};

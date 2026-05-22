import { msg } from '~/utils/i18n/badesI18n';
import { QueueMetricsTimeRange } from '~/generated-admin/graphql';

export const WORKER_QUEUE_METRICS_SELECT_OPTIONS = [
  { value: QueueMetricsTimeRange.SevenDays, label: msg`Minggu ini` },
  { value: QueueMetricsTimeRange.OneDay, label: msg`Hari ini` },
  {
    value: QueueMetricsTimeRange.TwelveHours,
    label: msg`12 jam terakhir`,
  },
  {
    value: QueueMetricsTimeRange.FourHours,
    label: msg`4 jam terakhir`,
  },
  { value: QueueMetricsTimeRange.OneHour, label: msg`1 jam terakhir` },
];

import { QueueMetricsTimeRange } from '~/generated-admin/graphql';

export const WORKER_QUEUE_METRICS_SELECT_OPTIONS = [
  { value: QueueMetricsTimeRange.SevenDays, label: `Minggu ini` },
  { value: QueueMetricsTimeRange.OneDay, label: `Hari ini` },
  {
    value: QueueMetricsTimeRange.TwelveHours,
    label: `12 jam terakhir`,
  },
  {
    value: QueueMetricsTimeRange.FourHours,
    label: `4 jam terakhir`,
  },
  { value: QueueMetricsTimeRange.OneHour, label: `1 jam terakhir` },
];

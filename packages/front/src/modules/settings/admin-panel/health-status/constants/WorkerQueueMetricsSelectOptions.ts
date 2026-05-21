import { msg } from '@lingui/core/macro';
import { QueueMetricsTimeRange } from '~/generated-admin/graphql';

export const WORKER_QUEUE_METRICS_SELECT_OPTIONS = [
  { value: QueueMetricsTimeRange.SevenDays, label: "Minggu ini" },
  { value: QueueMetricsTimeRange.OneDay, label: "Hari ini" },
  {
    value: QueueMetricsTimeRange.TwelveHours,
    label: ""Last 12 hours",
  },
  {
    value: QueueMetricsTimeRange.FourHours,
    label: ""Last 4 hours",
  },
  { value: QueueMetricsTimeRange.OneHour, label: ""Last 1 hour" },
];

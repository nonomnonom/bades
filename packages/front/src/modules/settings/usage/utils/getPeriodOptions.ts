import { t } from '~/utils/i18n/badesI18n';

import { type PeriodPreset } from '@/settings/usage/utils/periodPreset';

export const getPeriodOptions = (): {
  value: PeriodPreset;
  label: string;
}[] => [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

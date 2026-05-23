import { t } from '~/utils/i18n/badesI18n';

import { type PeriodPreset } from '@/settings/usage/utils/periodPreset';

export const getPeriodOptions = (): {
  value: PeriodPreset;
  label: string;
}[] => [
  { value: '7d', label: t`Last 7 days` },
  { value: '30d', label: t`Last 30 days` },
  { value: '90d', label: t`Last 90 days` },
];

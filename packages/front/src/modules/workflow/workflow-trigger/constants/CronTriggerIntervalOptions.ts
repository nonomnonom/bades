import {
  IconClockPlay,
  type IconComponent,
  IconHours24,
  IconTimeDuration60,
  IconBrandDaysCounter,
} from 'ui/display';
export type CronTriggerInterval = 'DAYS' | 'HOURS' | 'MINUTES' | 'CUSTOM';

export const CRON_TRIGGER_INTERVAL_OPTIONS: Array<{
  label: string;
  value: CronTriggerInterval;
  Icon: IconComponent;
}> = [
  {
    label: 'Hari',
    value: 'DAYS',
    Icon: IconBrandDaysCounter,
  },
  {
    label: 'Jam',
    value: 'HOURS',
    Icon: IconHours24,
  },
  {
    label: 'Menit',
    value: 'MINUTES',
    Icon: IconTimeDuration60,
  },
  {
    label: 'Cron (Kustom)',
    value: 'CUSTOM',
    Icon: IconClockPlay,
  },
];

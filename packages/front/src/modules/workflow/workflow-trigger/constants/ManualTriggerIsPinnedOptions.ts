import { type IconComponent, IconPinned, IconPinnedOff } from 'ui/display';

export const MANUAL_TRIGGER_IS_PINNED_OPTIONS: Array<{
  label: string;
  value: boolean;
  Icon: IconComponent;
}> = [
  {
    label: 'Tidak Disematkan',
    value: false,
    Icon: IconPinnedOff,
  },
  {
    label: 'Disematkan',
    value: true,
    Icon: IconPinned,
  },
];

import { type IconComponent, IconLockOpen, IconFlag } from 'ui/display';
export type AuthenticationMethods = 'API_KEY' | null;

export const WEBHOOK_TRIGGER_AUTHENTICATION_OPTIONS: Array<{
  label: string;
  value: AuthenticationMethods;
  Icon: IconComponent;
}> = [
  {
    label: 'Tidak ada',
    value: null,
    Icon: IconLockOpen,
  },
  {
    label: 'Kunci API',
    value: 'API_KEY',
    Icon: IconFlag,
  },
];

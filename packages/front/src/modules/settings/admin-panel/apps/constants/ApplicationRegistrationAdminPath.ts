import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const APPLICATION_REGISTRATION_ADMIN_PATH = getSettingsPath(
  SettingsPath.AdminPanel,
  undefined,
  undefined,
  'apps',
);

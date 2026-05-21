import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const AI_ADMIN_PATH = getSettingsPath(
  SettingsPath.AdminPanel,
  undefined,
  undefined,
  'ai',
);

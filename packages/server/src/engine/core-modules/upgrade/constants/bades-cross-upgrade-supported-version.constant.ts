import { BADES_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/bades-current-version.constant';
import { BADES_PREVIOUS_VERSIONS } from 'src/engine/core-modules/upgrade/constants/bades-previous-versions.constant';

export const BADES_CROSS_UPGRADE_SUPPORTED_VERSIONS = [
  ...BADES_PREVIOUS_VERSIONS,
  BADES_CURRENT_VERSION,
] as const;

export type BadesCrossUpgradeSupportedVersion =
  (typeof BADES_CROSS_UPGRADE_SUPPORTED_VERSIONS)[number];

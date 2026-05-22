import { BADES_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/bades-current-version.constant';
import { BADES_NEXT_VERSIONS } from 'src/engine/core-modules/upgrade/constants/bades-next-versions.constant';
import { BADES_PREVIOUS_VERSIONS } from 'src/engine/core-modules/upgrade/constants/bades-previous-versions.constant';

export const BADES_ALL_VERSIONS = [
  ...BADES_PREVIOUS_VERSIONS,
  BADES_CURRENT_VERSION,
  ...BADES_NEXT_VERSIONS,
] as const;

export type BadesAllVersion = (typeof BADES_ALL_VERSIONS)[number];

import {
  BADES_ALL_VERSIONS,
  BadesAllVersion,
} from 'src/engine/core-modules/upgrade/constants/bades-all-versions.constant';
import { BADES_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/bades-current-version.constant';
import { IndexOf, IsGreaterOrEqual } from 'shared/types';

export type RemovedSinceVersion<RemoveAtVersion extends BadesAllVersion, T> =
  IsGreaterOrEqual<
    IndexOf<typeof BADES_CURRENT_VERSION, typeof BADES_ALL_VERSIONS>,
    IndexOf<RemoveAtVersion, typeof BADES_ALL_VERSIONS>
  > extends true
    ? never
    : T;

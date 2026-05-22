import { BADES_STANDARD_APPLICATION } from 'src/engine/workspace-manager/bades-standard-application/constants/bades-standard-applications';
import { type UniversalSyncableFlatEntity } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-entity-from.type';

export const belongsToBadesStandardApp = <
  T extends UniversalSyncableFlatEntity,
>({
  applicationUniversalIdentifier,
}: T) =>
  applicationUniversalIdentifier ===
  BADES_STANDARD_APPLICATION.universalIdentifier;

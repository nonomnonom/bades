import {
  BADES_STANDARD_APPLICATION_NAME,
  BADES_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'shared/application';

import { ApplicationRegistrationSourceType } from 'src/engine/core-modules/application/application-registration/enums/application-registration-source-type.enum';
import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';

// description is owned by the frontend (translated) — see getStandardApplicationDescription.
export const BADES_STANDARD_APPLICATION = {
  universalIdentifier: BADES_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
  name: BADES_STANDARD_APPLICATION_NAME,
  description: null,
  version: '1.0.1',
  sourcePath: 'cli-sync',
  sourceType: ApplicationRegistrationSourceType.LOCAL,
} as const satisfies Pick<
  ApplicationEntity,
  | 'universalIdentifier'
  | 'name'
  | 'description'
  | 'version'
  | 'sourcePath'
  | 'sourceType'
>;

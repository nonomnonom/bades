import { BADES_STANDARD_APPLICATION } from 'src/engine/workspace-manager/bades-standard-application/constants/bades-standard-applications';
import { type WorkspaceMigrationBuilderOptions } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration-builder-options.type';

export const isCallerBadesStandardApp = (
  buildOptions: WorkspaceMigrationBuilderOptions,
) =>
  buildOptions.applicationUniversalIdentifier ===
  BADES_STANDARD_APPLICATION.universalIdentifier;

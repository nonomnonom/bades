import { v4 } from 'uuid';
import { isDefined } from 'shared/utils';

import { type ApplicationService } from 'src/engine/core-modules/application/application.service';
import { CommandMenuItemAvailabilityType } from 'src/engine/metadata-modules/command-menu-item/enums/command-menu-item-availability-type.enum';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';
import { type WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import {
  PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-workflows.util';
import { type WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const PENDAFTARAN_WARGA_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER =
  '5b389a80-345f-42b5-83fa-2e6b6ad95f01';

export const prefillWorkflowCommandMenuItems = async ({
  workspaceId,
  applicationService,
  flatEntityMapsCacheService,
  workspaceMigrationValidateBuildAndRunService,
}: {
  workspaceId: string;
  applicationService: ApplicationService;
  flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService;
  workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService;
}): Promise<void> => {
  const { workspaceCustomFlatApplication } =
    await applicationService.findWorkspaceBadesStandardAndCustomApplicationOrThrow(
      { workspaceId },
    );

  const { flatCommandMenuItemMaps } =
    await flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
      workspaceId,
      flatMapsKeys: ['flatCommandMenuItemMaps'],
    });

  const alreadyExists = isDefined(
    flatCommandMenuItemMaps.byUniversalIdentifier[
      PENDAFTARAN_WARGA_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER
    ],
  );

  if (alreadyExists) {
    return;
  }

  const now = new Date().toISOString();

  const pendaftaranWargaFlatCommandMenuItem: FlatCommandMenuItem = {
    id: v4(),
    universalIdentifier: PENDAFTARAN_WARGA_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
    applicationId: workspaceCustomFlatApplication.id,
    applicationUniversalIdentifier:
      workspaceCustomFlatApplication.universalIdentifier,
    workspaceId,
    workflowVersionId: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
    frontComponentId: null,
    frontComponentUniversalIdentifier: null,
    engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
    label: 'Pendaftaran Warga Baru',
    icon: 'IconUserPlus',
    shortLabel: 'Pendaftaran',
    position: 100,
    isPinned: false,
    availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
    conditionalAvailabilityExpression: null,
    availabilityObjectMetadataId: null,
    availabilityObjectMetadataUniversalIdentifier: null,
    payload: null,
    hotKeys: null,
    pageLayoutId: null,
    pageLayoutUniversalIdentifier: null,
    createdAt: now,
    updatedAt: now,
  };

  const result =
    await workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
      {
        allFlatEntityOperationByMetadataName: {
          commandMenuItem: {
            flatEntityToCreate: [pendaftaranWargaFlatCommandMenuItem],
            flatEntityToDelete: [],
            flatEntityToUpdate: [],
          },
        },
        workspaceId,
        applicationUniversalIdentifier:
          workspaceCustomFlatApplication.universalIdentifier,
      },
    );

  if (result.status === 'fail') {
    throw new Error(
      `Failed to create command menu item Pendaftaran Warga Baru for workspace ${workspaceId}: ${JSON.stringify(result, null, 2)}`,
    );
  }
};

import { Command } from 'nest-commander';
import { InjectDataSource } from '@nestjs/typeorm';

import { STANDARD_OBJECTS } from 'shared/metadata';
import { isDefined } from 'shared/utils';
import { DataSource } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { BadesStandardApplicationService } from 'src/engine/workspace-manager/bades-standard-application/services/bades-standard-application.service';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

// Backfill objek standar workflowAutomatedTrigger untuk workspace lama yang
// dibuat sebelum object ini ada di bades-standard application.
//
// Tanpa tabel ini, WorkflowCronTriggerCronJob gagal scan cron trigger setiap
// cache miss (~1 jam sekali).
//
// Idempotent: skip jika tabel sudah ada di schema workspace.
@RegisteredWorkspaceCommand('2.7.0', 1798000040000)
@Command({
  name: 'upgrade:2-7:backfill-workflow-automated-trigger',
  description:
    'Backfill tabel dan metadata workflowAutomatedTrigger untuk workspace lama',
})
export class BackfillWorkflowAutomatedTriggerCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly badesStandardApplicationService: BadesStandardApplicationService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;
    const schemaName = getWorkspaceSchemaName(workspaceId);

    const tableExistsResult = await this.coreDataSource.query<
      Array<{ exists: boolean }>
    >(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = $1 AND table_name = 'workflowAutomatedTrigger'
      ) as "exists"`,
      [schemaName],
    );

    if (tableExistsResult[0]?.exists) {
      this.logger.log(
        `Workspace ${workspaceId}: tabel workflowAutomatedTrigger sudah ada, skip`,
      );

      return;
    }

    const { flatObjectMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
      ]);

    const existingObjectMetadata =
      findFlatEntityByUniversalIdentifier<FlatObjectMetadata>({
        flatEntityMaps: flatObjectMetadataMaps,
        universalIdentifier:
          STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier,
      });

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: workflowAutomatedTrigger belum ada (metadata: ${isDefined(existingObjectMetadata) ? 'ada' : 'tidak ada'}), sinkronkan bades-standard`,
    );

    if (isDryRun) {
      return;
    }

    await this.badesStandardApplicationService.synchronizeBadesStandardApplicationOrThrow(
      {
        workspaceId,
      },
    );

    this.logger.log(
      `Selesai backfill workflowAutomatedTrigger untuk workspace ${workspaceId}`,
    );
  }
}

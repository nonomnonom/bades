import { Command } from 'nest-commander';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

// Backfill view MAP standar SID (Peta Keluarga, Penduduk, Penerima Bantuan,
// Aset Desa) ke workspace yang dibuat sebelum seed map view ada.
//
// Idempotent — ON CONFLICT (id) DO NOTHING di service.
@RegisteredWorkspaceCommand('2.7.0', 1798000050000)
@Command({
  name: 'upgrade:2-7:seed-sid-standard-map-views',
  description:
    'Seed view MAP standar SID (Peta Keluarga, Penduduk, Penerima Bantuan, Aset Desa) ke workspace lama',
})
export class SeedSidStandardMapViewsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly sidStandardSeedService: SidStandardSeedService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Akan seed view MAP SID ke workspace ${workspaceId}`,
      );

      return;
    }

    this.logger.log(`Seed view MAP SID ke workspace ${workspaceId}`);

    const result = await this.sidStandardSeedService.seedSidStandardMapViews({
      workspaceId,
    });

    this.logger.log(
      `Selesai seed view MAP untuk workspace ${workspaceId}: ${result.createdMapViews} view baru`,
    );
  }
}

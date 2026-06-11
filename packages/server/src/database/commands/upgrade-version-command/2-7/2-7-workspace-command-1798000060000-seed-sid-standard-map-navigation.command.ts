import { Command } from 'nest-commander';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@RegisteredWorkspaceCommand('2.7.0', 1798000060000)
@Command({
  name: 'upgrade:2-7:seed-sid-standard-map-navigation',
  description:
    'Seed item navigasi sidebar untuk view Peta SID (Keluarga, Penduduk, Aset Desa)',
})
export class SeedSidStandardMapNavigationCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
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
        `[DRY RUN] Akan seed navigasi Peta SID ke workspace ${workspaceId}`,
      );

      return;
    }

    const result =
      await this.sidStandardSeedService.seedSidStandardMapViewNavigationMenuItems(
        {
          workspaceId,
        },
      );

    this.logger.log(
      `Selesai seed navigasi Peta untuk workspace ${workspaceId}: ${result.createdNavigationItems} item baru`,
    );
  }
}

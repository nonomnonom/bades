import { Command } from 'nest-commander';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

// Seed 23 objek SID standar Bades (Penduduk, Keluarga, Wilayah, Lembaga
// Desa, Surat, Anggaran, Bantuan, Aset, dll) ke workspace yang sudah ada.
//
// Workspace baru otomatis dapat SID standard lewat workspace-manager.service
// pada flow init. Command ini menutup gap untuk workspace yang dibuat
// sebelum SID standard ditambahkan.
//
// Idempotent — service akan skip objek/field yang sudah ada di workspace,
// jadi aman dijalankan ulang.
@RegisteredWorkspaceCommand('1.22.0', 1780000005000)
@Command({
  name: 'upgrade:1-22:seed-sid-standard-objects',
  description:
    'Seed 23 objek SID standar Bades ke workspace lama (Penduduk, Keluarga, Wilayah, Lembaga Desa, dst)',
})
export class SeedSidStandardObjectsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
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
        `[DRY RUN] Akan seed SID standard ke workspace ${workspaceId}`,
      );

      return;
    }

    this.logger.log(`Seed SID standard ke workspace ${workspaceId}`);

    const result = await this.sidStandardSeedService.seedSidStandardObjects({
      workspaceId,
    });

    this.logger.log(
      `Selesai seed SID untuk workspace ${workspaceId}: ${result.createdObjects} objek baru, ${result.createdFields} field baru`,
    );
  }
}

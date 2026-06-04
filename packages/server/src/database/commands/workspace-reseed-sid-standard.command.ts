import { InjectRepository } from '@nestjs/typeorm';

import { Command, Option } from 'nest-commander';
import { Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import {
  type RunOnWorkspaceArgs,
  type WorkspaceCommandOptions,
} from 'src/database/commands/command-runners/workspace.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

type WorkspaceReseedSidStandardOptions = WorkspaceCommandOptions & {
  refreshData?: boolean;
};

// Jalankan ulang seed SID standar ke workspace yang sudah ada namun kosong.
//
// Kasus pakai:
//   1. Workspace lama (dibuat sebelum SID standard ada) — gunakan juga
//      upgrade:1-22:seed-sid-standard-objects untuk objek metadata.
//   2. Workspace baru yang terlanjur kosong karena INSERT data silent-fail
//      (mismatch kolom/enum) yang sudah di-fix di constant file.
//   3. Recovery pasca-upgrade ketika `seedSidStandardData` belum berjalan.
//
// Idempotent: `seedSidStandardObjects` skip objek yang sudah ada;
// `seedSidStandardData` pakai `ON CONFLICT (id) DO NOTHING` (kecuali
// `--refresh-data` yang hapus sample row lalu insert ulang);
// `seedSidStandardViewFields` pakai UPDATE yang aman diulang.
@Command({
  name: 'workspace:reseed:sid-standard',
  description:
    'Jalankan ulang seed SID standar (objek, relasi, data contoh, view) ke workspace yang kosong atau perlu recovery',
})
export class WorkspaceReseedSidStandardCommand extends ActiveOrSuspendedWorkspaceCommandRunner<WorkspaceReseedSidStandardOptions> {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly sidStandardSeedService: SidStandardSeedService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {
    super(workspaceIteratorService);
  }

  @Option({
    flags: '--refresh-data',
    description:
      'Hapus sample record SID (namespace 30303030-*) lalu insert ulang. Tanpa flag ini, row yang sudah ada tidak ditimpa.',
  })
  parseRefreshData(): boolean {
    return true;
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;
    const refreshData =
      (options as WorkspaceReseedSidStandardOptions).refreshData ?? false;

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Akan re-seed SID standard ke workspace ${workspaceId}${refreshData ? ' (refresh-data)' : ''}`,
      );

      return;
    }

    const workspace = await this.workspaceRepository.findOne({
      select: ['id', 'databaseSchema'],
      where: { id: workspaceId },
    });

    if (!workspace?.databaseSchema) {
      this.logger.warn(
        `Workspace ${workspaceId} belum punya databaseSchema — skip. Jalankan init workspace terlebih dahulu.`,
      );

      return;
    }

    const schemaName = workspace.databaseSchema;

    this.logger.log(
      `Mulai re-seed SID standard untuk workspace ${workspaceId} (schema: ${schemaName})`,
    );

    const objectResult =
      await this.sidStandardSeedService.seedSidStandardObjects({
        workspaceId,
      });

    this.logger.log(
      `[1/6] Objek: ${objectResult.createdObjects} objek baru, ${objectResult.createdFields} field baru`,
    );

    const relationResult =
      await this.sidStandardSeedService.seedSidStandardRelations({
        workspaceId,
      });

    this.logger.log(
      `[2/6] Relasi: ${relationResult.createdRelations} relation baru, ${relationResult.failedRelations} gagal`,
    );

    let insertedRecords: number;

    if (refreshData) {
      const refreshResult =
        await this.sidStandardSeedService.refreshSidStandardData({
          workspaceId,
          schemaName,
        });

      insertedRecords = refreshResult.insertedRecords;

      this.logger.log(
        `[3/6] Data: ${refreshResult.deletedRecords} dihapus, ${refreshResult.insertedRecords} disisipkan`,
      );
    } else {
      const seedResult = await this.sidStandardSeedService.seedSidStandardData({
        workspaceId,
        schemaName,
      });

      insertedRecords = seedResult.insertedRecords;

      this.logger.log(
        `[3/6] Data: ${seedResult.insertedRecords} record disisipkan`,
      );
    }

    const viewResult =
      await this.sidStandardSeedService.seedSidStandardViewFields({
        workspaceId,
      });

    this.logger.log(
      `[4/6] View: ${viewResult.visibleFields} field visible, ${viewResult.hiddenFields} field tersembunyi`,
    );

    const dashboardResult =
      await this.sidStandardSeedService.seedSidStandardDashboards({
        workspaceId,
        schemaName,
      });

    this.logger.log(
      `[5/6] Dashboard: ${dashboardResult.insertedDashboards} dashboard disisipkan`,
    );

    const workflowResult =
      await this.sidStandardSeedService.seedSidStandardWorkflows({
        workspaceId,
        schemaName,
      });

    this.logger.log(
      `[6/6] Workflow: ${workflowResult.insertedWorkflows} workflow disisipkan`,
    );

    this.logger.log(
      `Re-seed selesai untuk workspace ${workspaceId}: ${objectResult.createdObjects} objek baru, ${insertedRecords} record, ${viewResult.visibleFields} field visible, ${viewResult.hiddenFields} field tersembunyi, ${dashboardResult.insertedDashboards} dashboard, ${workflowResult.insertedWorkflows} workflow`,
    );
  }
}

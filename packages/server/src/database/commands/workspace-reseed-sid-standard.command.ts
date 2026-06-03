import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

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
// `seedSidStandardData` pakai `ON CONFLICT (id) DO NOTHING`;
// `seedSidStandardViewFields` pakai UPDATE yang aman diulang.
@Command({
  name: 'workspace:reseed:sid-standard',
  description:
    'Jalankan ulang seed SID standar (objek, data contoh, view) ke workspace yang kosong atau perlu recovery',
})
export class WorkspaceReseedSidStandardCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly sidStandardSeedService: SidStandardSeedService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
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
        `[DRY RUN] Akan re-seed SID standard ke workspace ${workspaceId}`,
      );

      return;
    }

    // Ambil schemaName dari workspace entity; dibutuhkan oleh seedSidStandardData
    // untuk INSERT raw ke schema workspace yang benar.
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

    // Langkah 1: objek + field metadata (idempotent, skip yang sudah ada)
    const objectResult =
      await this.sidStandardSeedService.seedSidStandardObjects({
        workspaceId,
      });

    this.logger.log(
      `[1/5] Objek: ${objectResult.createdObjects} objek baru, ${objectResult.createdFields} field baru`,
    );

    // Langkah 2: data contoh sample record (ON CONFLICT DO NOTHING)
    const dataResult = await this.sidStandardSeedService.seedSidStandardData({
      workspaceId,
      schemaName,
    });

    this.logger.log(
      `[2/5] Data: ${dataResult.insertedRecords} record disisipkan`,
    );

    // Langkah 3: rapikan view bawaan (sembunyikan field non-curated)
    const viewResult =
      await this.sidStandardSeedService.seedSidStandardViewFields({
        workspaceId,
      });

    this.logger.log(
      `[3/5] View: ${viewResult.hiddenFields} field disembunyikan dari tampilan default`,
    );

    // Langkah 4: dashboard contoh
    const dashboardResult =
      await this.sidStandardSeedService.seedSidStandardDashboards({
        workspaceId,
        schemaName,
      });

    this.logger.log(
      `[4/5] Dashboard: ${dashboardResult.insertedDashboards} dashboard disisipkan`,
    );

    // Langkah 5: workflow contoh
    const workflowResult =
      await this.sidStandardSeedService.seedSidStandardWorkflows({
        workspaceId,
        schemaName,
      });

    this.logger.log(
      `[5/5] Workflow: ${workflowResult.insertedWorkflows} workflow disisipkan`,
    );

    this.logger.log(
      `Re-seed selesai untuk workspace ${workspaceId}: ${objectResult.createdObjects} objek baru, ${dataResult.insertedRecords} record, ${viewResult.hiddenFields} field tersembunyi, ${dashboardResult.insertedDashboards} dashboard, ${workflowResult.insertedWorkflows} workflow`,
    );
  }
}

import { Command } from 'nest-commander';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { BadesStandardApplicationService } from 'src/engine/workspace-manager/bades-standard-application/services/bades-standard-application.service';

// Sinkronkan ulang aplikasi bades-standard pada setiap workspace lama supaya
// objek CRM warisan (`company`, `person`, `opportunity`) yang sudah
// di-seed sebelum rebrand SID benar-benar dihapus dari workspace user.
//
// Sync service memakai `inferDeletionFromMissingEntities: true` saat build
// migration, jadi object metadata yang sudah hilang dari registry standard
// otomatis dianggap "to be deleted" beserta:
//   - tabel `company`/`person`/`opportunity` di schema workspace
//   - field metadata + index + view + view-field terkait
//   - relasi turunan: attachment.target{Person,Company,Opportunity},
//     noteTarget.target{Person,Company,Opportunity},
//     taskTarget.target{Person,Company,Opportunity},
//     timelineActivity.target{Person,Company,Opportunity},
//     calendarEventParticipant.person, messageParticipant.person,
//     workspaceMember.ownedOpportunities
//
// Idempotent: kalau workspace tidak punya objek tersebut, sync no-op.
@RegisteredWorkspaceCommand('1.22.0', 1780000004000)
@Command({
  name: 'upgrade:1-22:sync-bades-standard-drop-crm-objects',
  description:
    'Sinkronkan workspace lama ke registry SID baru: drop tabel & relasi CRM warisan',
})
export class SyncBadesStandardDropCrmObjectsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly badesStandardApplicationService: BadesStandardApplicationService,
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
        `[DRY RUN] Akan sinkronkan bades-standard pada workspace ${workspaceId}`,
      );

      return;
    }

    this.logger.log(
      `Sinkronkan bades-standard pada workspace ${workspaceId} — drop CRM warisan jika ada`,
    );

    await this.badesStandardApplicationService.synchronizeBadesStandardApplicationOrThrow(
      {
        workspaceId,
      },
    );

    this.logger.log(
      `Selesai sinkronkan bades-standard pada workspace ${workspaceId}`,
    );
  }
}

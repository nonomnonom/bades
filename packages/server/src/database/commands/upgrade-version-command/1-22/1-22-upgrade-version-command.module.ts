import { Module } from '@nestjs/common';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { BackfillStandardSkillsCommand } from 'src/database/commands/upgrade-version-command/1-22/1-22-workspace-command-1780000002000-backfill-standard-skills.command';
import { FixMergeCommandSelectAllCommand } from 'src/database/commands/upgrade-version-command/1-22/1-22-workspace-command-1780000003000-fix-merge-command-select-all.command';
import { SyncBadesStandardDropCrmObjectsCommand } from 'src/database/commands/upgrade-version-command/1-22/1-22-workspace-command-1780000004000-sync-bades-standard-drop-crm-objects.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { BadesStandardApplicationModule } from 'src/engine/workspace-manager/bades-standard-application/bades-standard-application.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

@Module({
  imports: [
    ApplicationModule,
    BadesStandardApplicationModule,
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMigrationModule,
  ],
  providers: [
    BackfillStandardSkillsCommand,
    FixMergeCommandSelectAllCommand,
    SyncBadesStandardDropCrmObjectsCommand,
  ],
})
export class V1_22_UpgradeVersionCommandModule {}

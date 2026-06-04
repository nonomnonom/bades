import { Module } from '@nestjs/common';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { BackfillWorkflowAutomatedTriggerCommand } from 'src/database/commands/upgrade-version-command/2-7/2-7-workspace-command-1798000040000-backfill-workflow-automated-trigger.command';
import { DropFavoriteObjectsCommand } from 'src/database/commands/upgrade-version-command/2-7/2-7-workspace-command-1798000030000-drop-favorite-objects.command';
import { SyncCommandMenuItemAvailabilityExpressionsCommand } from 'src/database/commands/upgrade-version-command/2-7/2-7-workspace-command-1798000020000-sync-command-menu-item-availability-expressions.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { BadesStandardApplicationModule } from 'src/engine/workspace-manager/bades-standard-application/bades-standard-application.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

@Module({
  imports: [
    ApplicationModule,
    ObjectMetadataModule,
    TypeORMModule,
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMigrationModule,
    BadesStandardApplicationModule,
  ],
  providers: [
    BackfillWorkflowAutomatedTriggerCommand,
    DropFavoriteObjectsCommand,
    SyncCommandMenuItemAvailabilityExpressionsCommand,
  ],
})
export class V2_7_UpgradeVersionCommandModule {}

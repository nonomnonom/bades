import { Module } from '@nestjs/common';

import { WorkspaceResolverNameMapCacheModule } from 'src/engine/api/graphql/direct-execution/services/workspace-resolver-name-map-cache.module';
import { CoreEngineModule } from 'src/engine/core-modules/core-engine.module';
import { JobsModule } from 'src/engine/core-modules/message-queue/jobs.module';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { GlobalWorkspaceDataSourceModule } from 'src/engine/sid-orm/global-workspace-datasource/global-workspace-datasource.module';
import { SidOrmModule } from 'src/engine/sid-orm/sid-orm.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';

@Module({
  imports: [
    CoreEngineModule,
    MessageQueueModule.registerExplorer(),
    WorkspaceEventEmitterModule,
    JobsModule,
    SidOrmModule,
    GlobalWorkspaceDataSourceModule,
    // Daftarkan provider @WorkspaceCache('graphQLResolverNameMap') di DI root
    // worker supaya WorkspaceCacheService.onModuleInit dapat menemukannya via
    // DiscoveryService. Tanpa ini, worker yang menjalankan workspace-migration
    // runner (lewat job webhook/cron) gagal invalidate cache resolver name
    // map setelah commit transaksi.
    WorkspaceResolverNameMapCacheModule,
  ],
})
export class QueueWorkerModule {}

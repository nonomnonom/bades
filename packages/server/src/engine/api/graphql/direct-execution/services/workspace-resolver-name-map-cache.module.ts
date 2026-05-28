import { Module } from '@nestjs/common';

import { WorkspaceResolverNameMapCacheService } from 'src/engine/api/graphql/direct-execution/services/workspace-resolver-name-map-cache.service';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

// Module kecil yang hanya men-declare provider cache resolver-name-map.
// Tujuannya supaya worker (yang tidak butuh seluruh DirectExecutionModule
// dengan dependency GraphQL berat-nya) tetap bisa register provider
// `@WorkspaceCache('graphQLResolverNameMap')` di DI root, sehingga
// WorkspaceCacheService.onModuleInit dapat menemukannya via DiscoveryService.
@Module({
  imports: [WorkspaceCacheModule],
  providers: [WorkspaceResolverNameMapCacheService],
  exports: [WorkspaceResolverNameMapCacheService],
})
export class WorkspaceResolverNameMapCacheModule {}

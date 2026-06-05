import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { BillingModule } from 'src/engine/core-modules/billing/billing.module';
import { WorkspaceDomainsModule } from 'src/engine/core-modules/domain/workspace-domains/workspace-domains.module';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { FileModule } from 'src/engine/core-modules/file/file.module';
import { ThrottlerModule } from 'src/engine/core-modules/throttler/throttler.module';
import { ToolModule } from 'src/engine/core-modules/tool/tool.module';
import { ToolProviderModule } from 'src/engine/core-modules/tool-provider/tool-provider.module';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { AgentMessagePartEntity } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-message-part.entity';
import { AgentTurnEntity } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-turn.entity';
import { UserWorkspaceModule } from 'src/engine/core-modules/user-workspace/user-workspace.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AiAgentExecutionModule } from 'src/engine/metadata-modules/ai/ai-agent-execution/ai-agent-execution.module';
import { AiBillingModule } from 'src/engine/metadata-modules/ai/ai-billing/ai-billing.module';
import { AiGraphqlApiExceptionInterceptor } from 'src/engine/metadata-modules/ai/interceptors/ai-graphql-api-exception.interceptor';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { SkillModule } from 'src/engine/metadata-modules/skill/skill.module';
import { SidOrmModule } from 'src/engine/sid-orm/sid-orm.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { DashboardToolsModule } from 'src/modules/dashboard/tools/dashboard-tools.module';
import { WorkflowToolsModule } from 'src/modules/workflow/workflow-tools/workflow-tools.module';

import { AgentChatThreadEntity } from './entities/agent-chat-thread.entity';
import { StreamAgentChatJob } from './jobs/stream-agent-chat.job';
import { AgentChatResolver } from './resolvers/agent-chat.resolver';
import { AgentChatSubscriptionResolver } from './resolvers/agent-chat-subscription.resolver';
import { AgentChatCancelSubscriberService } from './services/agent-chat-cancel-subscriber.service';
import { AgentChatEventPublisherService } from './services/agent-chat-event-publisher.service';
import { AgentChatStreamingService } from './services/agent-chat-streaming.service';
import { AgentChatService } from './services/agent-chat.service';
import { AgentTitleGenerationService } from './services/agent-title-generation.service';
import { AiChatPreloadToolsResolverService } from './services/ai-chat-preload-tools-resolver.service';
import { AgentTurnMetricsService } from './services/agent-turn-metrics.service';
import { ChatExecutionService } from './services/chat-execution.service';
import { MessagePruningService } from './services/message-pruning.service';
import { SystemPromptBuilderService } from './services/system-prompt-builder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentChatThreadEntity,
      AgentMessagePartEntity,
      AgentTurnEntity,
      FileEntity,
      UserWorkspaceEntity,
      WorkspaceEntity,
    ]),
    AiAgentExecutionModule,
    BillingModule,
    ThrottlerModule,
    FileModule,
    PermissionsModule,
    SkillModule,
    WorkspaceCacheStorageModule,
    WorkspaceCacheModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
    WorkspaceDomainsModule,
    SidOrmModule,
    TokenModule,
    UserWorkspaceModule,
    AiBillingModule,
    ToolProviderModule,
    ToolModule,
    DashboardToolsModule,
    WorkflowToolsModule,
  ],
  providers: [
    AgentChatCancelSubscriberService,
    AgentChatEventPublisherService,
    AgentChatResolver,
    AgentChatSubscriptionResolver,
    AgentChatService,
    AgentChatStreamingService,
    AgentTitleGenerationService,
    AiChatPreloadToolsResolverService,
    AgentTurnMetricsService,
    ChatExecutionService,
    MessagePruningService,
    StreamAgentChatJob,
    SystemPromptBuilderService,
    AiGraphqlApiExceptionInterceptor,
  ],
  exports: [
    AgentChatService,
    AgentChatStreamingService,
    TypeOrmModule.forFeature([AgentChatThreadEntity]),
  ],
})
export class AiChatModule {}

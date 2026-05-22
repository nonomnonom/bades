import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from 'src/engine/core-modules/audit/audit.module';
import { BillingMidtransWebhookController } from 'src/engine/core-modules/billing-webhook/billing-midtrans-webhook.controller';
import { BillingMidtransWebhookService } from 'src/engine/core-modules/billing-webhook/services/billing-midtrans-webhook.service';
import { BillingModule } from 'src/engine/core-modules/billing/billing.module';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingMidtransTransactionEntity } from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { BillingEntitlementEntity } from 'src/engine/core-modules/billing/entities/billing-entitlement.entity';
import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingProductEntity } from 'src/engine/core-modules/billing/entities/billing-product.entity';
import { BillingSubscriptionItemEntity } from 'src/engine/core-modules/billing/entities/billing-subscription-item.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { MidtransModule } from 'src/engine/core-modules/billing/midtrans/midtrans.module';
import { FeatureFlagEntity } from 'src/engine/core-modules/feature-flag/feature-flag.entity';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { RowLevelPermissionModule } from 'src/engine/metadata-modules/row-level-permission-predicate/row-level-permission.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

@Module({
  imports: [
    AuditModule,
    FeatureFlagModule,
    MidtransModule,
    MessageQueueModule,
    PermissionsModule,
    WorkspaceModule,
    BillingModule,
    WorkspaceCacheModule,
    TypeOrmModule.forFeature([
      BillingSubscriptionEntity,
      BillingSubscriptionItemEntity,
      BillingCustomerEntity,
      BillingMidtransTransactionEntity,
      BillingProductEntity,
      BillingPriceEntity,
      BillingEntitlementEntity,
      WorkspaceEntity,
      UserWorkspaceEntity,
      FeatureFlagEntity,
    ]),
    RowLevelPermissionModule,
  ],
  controllers: [BillingMidtransWebhookController],
  providers: [BillingMidtransWebhookService],
})
export class BillingWebhookModule {}

/* @license Enterprise */

import { InjectRepository } from '@nestjs/typeorm';

import { Command, Option } from 'nest-commander';
import { isDefined } from 'shared/utils';
import { Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { StripeSubscriptionItemService } from 'src/engine/core-modules/billing/stripe/services/stripe-subscription-item.service';

@Command({
  name: 'billing:update-subscription-price',
  description: 'Update subscription price',
})
export class BillingUpdateSubscriptionPriceCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  private priceIdToUpdate: string;
  private newPriceId: string;
  private clearUsage = false;

  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    @InjectRepository(BillingSubscriptionEntity)
    protected readonly billingSubscriptionRepository: Repository<BillingSubscriptionEntity>,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly stripeSubscriptionItemService: StripeSubscriptionItemService,
  ) {
    super(workspaceIteratorService);
  }

  @Option({
    flags: '--price-to-update-id [price_id]',
    description: 'Price id to update',
    required: true,
  })
  parsePriceIdToMigrate(val: string): string {
    this.priceIdToUpdate = val;

    return val;
  }

  @Option({
    flags: '--new-price-id [price_id]',
    description: 'New price id',
    required: true,
  })
  parseNewPriceId(val: string): string {
    this.newPriceId = val;

    return val;
  }

  @Option({
    flags: '--clear-usage',
    description: 'Clear usage on subscription item',
    required: false,
  })
  parseClearUsage() {
    this.clearUsage = true;
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const subscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    const subscriptionItemToUpdate = subscription.billingSubscriptionItems.find(
      (item) => item.priceId === this.priceIdToUpdate,
    );

    if (!isDefined(subscriptionItemToUpdate)) {
      this.logger.log(`No price to update for workspace ${workspaceId}`);

      return;
    }

    if (!options.dryRun) {
      await this.stripeSubscriptionItemService.deleteSubscriptionItem(
        subscriptionItemToUpdate.stripeSubscriptionItemId,
        this.clearUsage,
      );

      await this.stripeSubscriptionItemService.createSubscriptionItem(
        subscription.stripeSubscriptionId,
        this.newPriceId,
        isDefined(subscriptionItemToUpdate.quantity)
          ? subscriptionItemToUpdate.quantity
          : undefined,
      );
    }

    this.logger.log(
      `Update subscription replacing price ${subscriptionItemToUpdate.priceId} by ${this.newPriceId} with clear usage ${this.clearUsage} - workspace ${workspaceId}`,
    );
  }
}

/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  assertIsDefinedOrThrow,
  assertUnreachable,
  isDefined,
} from 'shared/utils';
import { In, type Repository } from 'typeorm';

import { billingValidator } from 'src/engine/core-modules/billing/billing.validate';
import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingSubscriptionItemEntity } from 'src/engine/core-modules/billing/entities/billing-subscription-item.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { BillingProductKey } from 'src/engine/core-modules/billing/enums/billing-product-key.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { BillingPriceService } from 'src/engine/core-modules/billing/services/billing-price.service';
import { BillingProductService } from 'src/engine/core-modules/billing/services/billing-product.service';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import {
  type SubscriptionUpdate,
  SubscriptionUpdateType,
} from 'src/engine/core-modules/billing/types/billing-subscription-update.type';
import { getCurrentLicensedBillingSubscriptionItemOrThrow } from 'src/engine/core-modules/billing/utils/get-licensed-billing-subscription-item-or-throw.util';
import { getCurrentResourceCreditSubscriptionItemOrThrow } from 'src/engine/core-modules/billing/utils/get-resource-credit-subscription-item-or-throw.util';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export type SubscriptionPrices = {
  licensedPriceId: string;
  seats: number;
  resourceCreditPriceId: string;
};

@Injectable()
export class BillingSubscriptionUpdateService {
  protected readonly logger = new Logger(BillingSubscriptionUpdateService.name);

  constructor(
    private readonly billingPriceService: BillingPriceService,
    private readonly billingProductService: BillingProductService,
    @InjectRepository(BillingPriceEntity)
    private readonly billingPriceRepository: Repository<BillingPriceEntity>,
    @InjectRepository(BillingSubscriptionItemEntity)
    private readonly billingSubscriptionItemRepository: Repository<BillingSubscriptionItemEntity>,
    @InjectRepository(BillingSubscriptionEntity)
    private readonly billingSubscriptionRepository: Repository<BillingSubscriptionEntity>,
    private readonly billingSubscriptionService: BillingSubscriptionService,
  ) {}

  async changeResourceCreditPrice(
    workspaceId: string,
    resourceCreditPriceId: string,
  ): Promise<void> {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );
    const subscriptionUpdate = {
      type: SubscriptionUpdateType.RESOURCE_CREDIT_PRICE,
      newResourceCreditPriceId: resourceCreditPriceId,
    } as const;

    await this.updateSubscription(billingSubscription.id, subscriptionUpdate);
  }

  async cancelSwitchResourceCreditPrice(
    workspace: WorkspaceEntity,
  ): Promise<void> {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId: workspace.id },
      );

    const currentResourceCreditPrice =
      getCurrentResourceCreditSubscriptionItemOrThrow(billingSubscription);
    const subscriptionUpdate = {
      type: SubscriptionUpdateType.RESOURCE_CREDIT_PRICE,
      newResourceCreditPriceId: currentResourceCreditPrice.priceId,
    } as const;

    await this.updateSubscription(billingSubscription.id, subscriptionUpdate);
  }

  async cancelSwitchPlan(workspaceId: string) {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    const currentPlan =
      getCurrentLicensedBillingSubscriptionItemOrThrow(billingSubscription)
        .billingProduct?.metadata.planKey;

    await this.updateSubscription(billingSubscription.id, {
      type: SubscriptionUpdateType.PLAN,
      newPlan: currentPlan,
    });
  }

  async cancelSwitchInterval(workspaceId: string) {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    const currentInterval = billingSubscription.interval;

    await this.updateSubscription(billingSubscription.id, {
      type: SubscriptionUpdateType.INTERVAL,
      newInterval: currentInterval,
    });
  }

  async changeInterval(workspaceId: string) {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    const currentInterval = billingSubscription.interval;

    await this.updateSubscription(billingSubscription.id, {
      type: SubscriptionUpdateType.INTERVAL,
      newInterval:
        currentInterval === SubscriptionInterval.Month
          ? SubscriptionInterval.Year
          : SubscriptionInterval.Month,
    });
  }

  async changePlan(workspaceId: string) {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    const currentPlan =
      getCurrentLicensedBillingSubscriptionItemOrThrow(billingSubscription)
        .billingProduct?.metadata.planKey;

    await this.updateSubscription(billingSubscription.id, {
      type: SubscriptionUpdateType.PLAN,
      newPlan:
        currentPlan === BillingPlanKey.ENTERPRISE
          ? BillingPlanKey.PRO
          : BillingPlanKey.ENTERPRISE,
    });
  }

  async changeSeats(workspaceId: string, newSeats: number) {
    const billingSubscription =
      await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
        { workspaceId },
      );

    await this.updateSubscription(billingSubscription.id, {
      type: SubscriptionUpdateType.SEATS,
      newSeats,
    });
  }

  /**
   * Update subscription secara DB-only (tanpa Stripe).
   * Perubahan yang berlaku di periode berikutnya dicatat di field `phases`.
   */
  async updateSubscription(
    subscriptionId: string,
    subscriptionUpdate: SubscriptionUpdate,
  ): Promise<void> {
    const subscription = await this.billingSubscriptionRepository.findOneOrFail(
      {
        where: { id: subscriptionId },
        relations: [
          'billingSubscriptionItems',
          'billingSubscriptionItems.billingProduct',
        ],
      },
    );

    const shouldScheduleForNextPeriod =
      await this.shouldUpdateAtSubscriptionPeriodEnd(
        subscription,
        subscriptionUpdate,
      );

    switch (subscriptionUpdate.type) {
      case SubscriptionUpdateType.PLAN: {
        if (!shouldScheduleForNextPeriod) {
          await this.billingSubscriptionRepository.update(subscriptionId, {
            planKey: subscriptionUpdate.newPlan,
          });
          await this.updateSubscriptionItemsForPlan(
            subscriptionId,
            subscriptionUpdate.newPlan,
            subscription.interval,
          );
        } else {
          // Catat perubahan ke phases untuk berlaku di awal periode berikutnya
          const updatedPhases = [
            ...subscription.phases,
            {
              start_date: Math.floor(
                subscription.currentPeriodEnd.getTime() / 1000,
              ),
              end_date: 0,
              items: [
                { price: `scheduled:plan:${subscriptionUpdate.newPlan}` },
              ],
            },
          ];

          await this.billingSubscriptionRepository.update(subscriptionId, {
            phases: updatedPhases,
          });
        }
        break;
      }
      case SubscriptionUpdateType.INTERVAL: {
        if (!shouldScheduleForNextPeriod) {
          await this.billingSubscriptionRepository.update(subscriptionId, {
            interval: subscriptionUpdate.newInterval,
          });
          await this.updateSubscriptionItemsForInterval(
            subscriptionId,
            subscription.planKey ?? BillingPlanKey.PRO,
            subscriptionUpdate.newInterval,
          );
        } else {
          const updatedPhases = [
            ...subscription.phases,
            {
              start_date: Math.floor(
                subscription.currentPeriodEnd.getTime() / 1000,
              ),
              end_date: 0,
              items: [
                {
                  price: `scheduled:interval:${subscriptionUpdate.newInterval}`,
                },
              ],
            },
          ];

          await this.billingSubscriptionRepository.update(subscriptionId, {
            phases: updatedPhases,
          });
        }
        break;
      }
      case SubscriptionUpdateType.SEATS: {
        // Update jumlah seat pada subscription item produk dasar
        const licensedItem =
          getCurrentLicensedBillingSubscriptionItemOrThrow(subscription);

        await this.billingSubscriptionItemRepository.update(licensedItem.id, {
          quantity: subscriptionUpdate.newSeats,
        });
        break;
      }
      case SubscriptionUpdateType.RESOURCE_CREDIT_PRICE: {
        const resourceCreditItem =
          getCurrentResourceCreditSubscriptionItemOrThrow(subscription);

        if (!shouldScheduleForNextPeriod) {
          await this.billingSubscriptionItemRepository.update(
            resourceCreditItem.id,
            {
              priceId: subscriptionUpdate.newResourceCreditPriceId,
              hasReachedCurrentPeriodCap: false,
            },
          );
        } else {
          const updatedPhases = [
            ...subscription.phases,
            {
              start_date: Math.floor(
                subscription.currentPeriodEnd.getTime() / 1000,
              ),
              end_date: 0,
              items: [
                {
                  price: subscriptionUpdate.newResourceCreditPriceId,
                  quantity: undefined,
                },
              ],
            },
          ];

          await this.billingSubscriptionRepository.update(subscriptionId, {
            phases: updatedPhases,
          });
        }
        break;
      }
      default:
        return assertUnreachable(
          subscriptionUpdate,
          'Tipe update subscription tidak dikenal',
        );
    }
  }

  private async updateSubscriptionItemsForPlan(
    subscriptionId: string,
    planKey: BillingPlanKey,
    interval: SubscriptionInterval,
  ): Promise<void> {
    const prices = await this.billingProductService.getProductPrices({
      planKey,
      interval,
    });

    for (const price of prices) {
      const productKey = price.billingProduct?.metadata?.productKey;

      if (isDefined(productKey)) {
        await this.billingSubscriptionItemRepository.update(
          {
            billingSubscriptionId: subscriptionId,
            productCode: price.productCode,
          },
          { priceId: price.priceId },
        );
      }
    }
  }

  private async updateSubscriptionItemsForInterval(
    subscriptionId: string,
    planKey: BillingPlanKey,
    interval: SubscriptionInterval,
  ): Promise<void> {
    await this.updateSubscriptionItemsForPlan(
      subscriptionId,
      planKey,
      interval,
    );
  }

  async shouldUpdateAtSubscriptionPeriodEnd(
    subscription: BillingSubscriptionEntity,
    update: SubscriptionUpdate,
  ): Promise<boolean> {
    switch (update.type) {
      case SubscriptionUpdateType.PLAN: {
        const currentPlan = subscription.planKey;
        const isDowngrade =
          currentPlan !== update.newPlan &&
          update.newPlan === BillingPlanKey.PRO;

        return isDowngrade;
      }
      case SubscriptionUpdateType.RESOURCE_CREDIT_PRICE: {
        const currentResourceCreditPriceId =
          subscription.billingSubscriptionItems.find(
            (item) =>
              item.billingProduct?.metadata.productKey ===
              BillingProductKey.RESOURCE_CREDIT,
          )?.priceId;

        assertIsDefinedOrThrow(currentResourceCreditPriceId);
        const currentResourceCreditPrice =
          await this.billingPriceRepository.findOneOrFail({
            where: { priceId: currentResourceCreditPriceId },
            relations: ['billingProduct'],
          });
        const newResourceCreditPrice =
          await this.billingPriceRepository.findOneOrFail({
            where: { priceId: update.newResourceCreditPriceId },
            relations: ['billingProduct'],
          });

        billingValidator.assertIsLicensedResourceCreditPrice(
          currentResourceCreditPrice,
        );
        billingValidator.assertIsLicensedResourceCreditPrice(
          newResourceCreditPrice,
        );

        const currentCap = Number(
          currentResourceCreditPrice.metadata?.credit_amount,
        );
        const newCap = Number(newResourceCreditPrice.metadata?.credit_amount);

        return currentCap > newCap;
      }
      case SubscriptionUpdateType.SEATS:
        return false;
      case SubscriptionUpdateType.INTERVAL: {
        const currentInterval = subscription.interval;
        const isDowngrade =
          currentInterval !== update.newInterval &&
          update.newInterval === SubscriptionInterval.Month;

        return isDowngrade;
      }
      default: {
        return assertUnreachable(
          update,
          'Tipe update subscription tidak dikenal',
        );
      }
    }
  }
}

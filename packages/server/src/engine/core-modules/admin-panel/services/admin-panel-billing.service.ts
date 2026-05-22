import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, type Repository } from 'typeorm';

import { AdminPanelWorkspaceBillingDTO } from 'src/engine/core-modules/admin-panel/dtos/admin-panel-workspace-billing.dto';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

const CREDIT_BALANCE_MICRO_UNIT = 1_000_000;

@Injectable()
export class AdminPanelBillingService {
  constructor(
    @InjectRepository(BillingCustomerEntity)
    private readonly billingCustomerRepository: Repository<BillingCustomerEntity>,
    @InjectRepository(BillingPriceEntity)
    private readonly billingPriceRepository: Repository<BillingPriceEntity>,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly badesConfigService: BadesConfigService,
  ) {}

  async getWorkspaceBilling(
    workspaceId: string,
  ): Promise<AdminPanelWorkspaceBillingDTO | null> {
    if (!this.badesConfigService.get('IS_BILLING_ENABLED')) {
      return null;
    }

    const [customer, subscription] = await Promise.all([
      this.billingCustomerRepository.findOne({ where: { workspaceId } }),
      this.billingSubscriptionService.getCurrentBillingSubscription({
        workspaceId,
      }),
    ]);

    if (!customer && !subscription) {
      return null;
    }

    const billingCustomerId = customer?.id ?? subscription?.billingCustomerId ?? null;
    const creditBalance = customer
      ? customer.creditBalanceMicro / CREDIT_BALANCE_MICRO_UNIT
      : null;

    if (!subscription) {
      return {
        billingCustomerId,
        creditBalance,
        subscription: null,
      };
    }

    const items = subscription.billingSubscriptionItems ?? [];
    const priceIds = items.map((item) => item.priceId);
    const prices = priceIds.length
      ? await this.billingPriceRepository.find({
          where: { priceId: In(priceIds) },
        })
      : [];
    const priceByPriceId = new Map(
      prices.map((price) => [price.priceId, price]),
    );

    const planKey = subscription.planKey ?? null;

    return {
      billingCustomerId,
      creditBalance,
      subscription: {
        subscriptionId: subscription.id,
        status: subscription.status,
        interval: subscription.interval ?? null,
        currency: subscription.currency,
        planKey,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        trialStart: subscription.trialStart,
        trialEnd: subscription.trialEnd,
        cancelAt: subscription.cancelAt,
        canceledAt: subscription.canceledAt,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        items: items.map((item) => {
          const price = priceByPriceId.get(item.priceId);
          const firstTier = price?.tiers?.[0];
          const productKey = item.billingProduct?.metadata?.productKey;

          return {
            productName: item.billingProduct?.name ?? '',
            productKey: typeof productKey === 'string' ? productKey : null,
            priceId: item.priceId,
            quantity: item.quantity != null ? Number(item.quantity) : null,
            unitAmount:
              price?.unitAmount != null ? Number(price.unitAmount) : null,
            includedCredits:
              typeof firstTier?.up_to === 'number' ? firstTier.up_to : null,
          };
        }),
      },
    };
  }
}

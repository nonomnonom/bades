/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { addMonths, addYears, differenceInDays } from 'date-fns';
import { assertIsDefinedOrThrow, isDefined } from 'shared/utils';
import { Not, type Repository } from 'typeorm';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingEntitlementDTO } from 'src/engine/core-modules/billing/dtos/billing-entitlement.dto';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingEntitlementEntity } from 'src/engine/core-modules/billing/entities/billing-entitlement.entity';
import { BillingSubscriptionItemEntity } from 'src/engine/core-modules/billing/entities/billing-subscription-item.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingEntitlementKey } from 'src/engine/core-modules/billing/enums/billing-entitlement-key.enum';
import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { SubscriptionStatus } from 'src/engine/core-modules/billing/enums/billing-subscription-status.enum';
import { MidtransSnapService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-snap.service';
import { BillingPlanService } from 'src/engine/core-modules/billing/services/billing-plan.service';
import { BillingPriceService } from 'src/engine/core-modules/billing/services/billing-price.service';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

@Injectable()
export class BillingSubscriptionService {
  protected readonly logger = new Logger(BillingSubscriptionService.name);

  constructor(
    private readonly billingPriceService: BillingPriceService,
    private readonly billingPlanService: BillingPlanService,
    private readonly midtransSnapService: MidtransSnapService,
    @InjectRepository(BillingEntitlementEntity)
    private readonly billingEntitlementRepository: Repository<BillingEntitlementEntity>,
    @InjectRepository(BillingSubscriptionEntity)
    private readonly billingSubscriptionRepository: Repository<BillingSubscriptionEntity>,
    @InjectRepository(BillingSubscriptionItemEntity)
    private readonly billingSubscriptionItemRepository: Repository<BillingSubscriptionItemEntity>,
    @InjectRepository(BillingCustomerEntity)
    private readonly billingCustomerRepository: Repository<BillingCustomerEntity>,
    private readonly badesConfigService: BadesConfigService,
    private readonly enterprisePlanService: EnterprisePlanService,
  ) {}

  async getBillingSubscriptions(workspaceId: string) {
    return await this.billingSubscriptionRepository.find({
      where: { workspaceId },
    });
  }

  async getCurrentBillingSubscription(criteria: {
    workspaceId?: string;
    billingCustomerId?: string;
  }): Promise<BillingSubscriptionEntity | undefined> {
    const notCanceledSubscriptions =
      await this.billingSubscriptionRepository.find({
        where: { ...criteria, status: Not(SubscriptionStatus.Canceled) },
        relations: [
          'billingSubscriptionItems',
          'billingSubscriptionItems.billingProduct',
        ],
      });

    if (notCanceledSubscriptions.length > 1) {
      throw new BillingException(
        `Lebih dari satu subscription aktif untuk workspace ${criteria.workspaceId}`,
        BillingExceptionCode.BILLING_TOO_MUCH_SUBSCRIPTIONS_FOUND,
      );
    }

    return notCanceledSubscriptions[0];
  }

  async getCurrentBillingSubscriptionOrThrow(criteria: {
    workspaceId?: string;
    billingCustomerId?: string;
  }): Promise<BillingSubscriptionEntity> {
    const notCanceledSubscription =
      await this.getCurrentBillingSubscription(criteria);

    assertIsDefinedOrThrow(
      notCanceledSubscription,
      new BillingException(
        `Tidak ada subscription aktif untuk workspace ${criteria.workspaceId}`,
        BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND,
      ),
    );

    return notCanceledSubscription;
  }

  async getBaseProductCurrentBillingSubscriptionItemOrThrow(
    workspaceId: string,
  ) {
    const billingSubscription = await this.getCurrentBillingSubscriptionOrThrow(
      { workspaceId },
    );

    const planKey = billingSubscription.planKey ?? BillingPlanKey.PRO;

    const baseProduct =
      await this.billingPlanService.getPlanBaseProduct(planKey);

    if (!baseProduct) {
      throw new BillingException(
        'Produk dasar tidak ditemukan',
        BillingExceptionCode.BILLING_PRODUCT_NOT_FOUND,
      );
    }

    const productCode = baseProduct.productCode;

    const billingSubscriptionItem =
      billingSubscription.billingSubscriptionItems.find(
        (item) => item.productCode === productCode,
      );

    if (!billingSubscriptionItem) {
      throw new BillingException(
        `Tidak dapat menemukan billingSubscriptionItem untuk produk ${productCode} workspace ${workspaceId}`,
        BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_NOT_FOUND,
      );
    }

    return billingSubscriptionItem;
  }

  async deleteSubscriptions(workspaceId: string) {
    await this.billingSubscriptionRepository.delete({ workspaceId });
  }

  /**
   * Membuat atau memperbarui subscription DB-only.
   * Menggantikan syncSubscriptionToDatabase berbasis Stripe.
   */
  async createOrRenewSubscription(
    workspaceId: string,
    planKey: BillingPlanKey,
    interval: SubscriptionInterval,
    status: SubscriptionStatus = SubscriptionStatus.Active,
  ): Promise<BillingSubscriptionEntity> {
    let customer = await this.billingCustomerRepository.findOne({
      where: { workspaceId },
    });

    if (!isDefined(customer)) {
      customer = this.billingCustomerRepository.create({ workspaceId });
      customer = await this.billingCustomerRepository.save(customer);
    }

    const periodStart = new Date();
    const periodEnd =
      interval === SubscriptionInterval.Month
        ? addMonths(periodStart, 1)
        : addYears(periodStart, 1);

    const existing = await this.billingSubscriptionRepository.findOne({
      where: { workspaceId, status: Not(SubscriptionStatus.Canceled) },
    });

    if (isDefined(existing)) {
      // Saat renewal aktif: perpanjang dari currentPeriodEnd lama agar tidak ada gap
      const baseStart =
        status === SubscriptionStatus.Active
          ? (existing.currentPeriodEnd ?? periodStart)
          : periodStart;

      const newPeriodEnd =
        interval === SubscriptionInterval.Month
          ? addMonths(baseStart, 1)
          : addYears(baseStart, 1);

      await this.billingSubscriptionRepository.update(existing.id, {
        status,
        planKey,
        interval,
        billingCustomerId: customer.id,
        currentPeriodStart: baseStart,
        currentPeriodEnd: newPeriodEnd,
      });

      await this.billingSubscriptionItemRepository.update(
        { billingSubscriptionId: existing.id },
        { hasReachedCurrentPeriodCap: false },
      );

      return await this.billingSubscriptionRepository.findOneOrFail({
        where: { id: existing.id },
        relations: [
          'billingSubscriptionItems',
          'billingSubscriptionItems.billingProduct',
        ],
      });
    }

    const subscription = this.billingSubscriptionRepository.create({
      workspaceId,
      billingCustomerId: customer.id,
      planKey,
      status,
      interval,
      currency: 'IDR',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      phases: [],
    });

    return await this.billingSubscriptionRepository.save(subscription);
  }

  async getWorkspaceEntitlements(
    workspaceId: string,
  ): Promise<BillingEntitlementDTO[]> {
    const isBillingEnabled = this.badesConfigService.get('IS_BILLING_ENABLED');
    const hasValidEnterprisePlan = this.enterprisePlanService.isValid();

    const entitlements = isBillingEnabled
      ? await this.billingEntitlementRepository.find({
          where: { workspaceId },
        })
      : [];

    const entitlementsByKey = entitlements.reduce(
      (acc, entitlement) => {
        acc[entitlement.key] = entitlement;

        return acc;
      },
      {} as Record<BillingEntitlementKey, BillingEntitlementEntity>,
    );

    return Object.values(BillingEntitlementKey).map((key) => ({
      key,
      value:
        hasValidEnterprisePlan &&
        (!isBillingEnabled || (entitlementsByKey[key]?.value ?? false)),
    }));
  }

  async getWorkspaceEntitlementByKey(
    workspaceId: string,
    key: BillingEntitlementKey,
  ): Promise<boolean> {
    const entitlement = await this.billingEntitlementRepository.findOneBy({
      workspaceId,
      key,
      value: true,
    });

    return entitlement?.value ?? false;
  }

  /**
   * Mengakhiri masa percobaan dengan membuat sesi Snap pembayaran.
   * Kembalikan checkoutUrl + orderId agar front-end redirect ke Snap.
   */
  async endTrialPeriod(
    workspace: WorkspaceEntity,
    customerEmail: string,
  ): Promise<{ checkoutUrl: string; orderId: string }> {
    const billingSubscription = await this.getCurrentBillingSubscriptionOrThrow(
      { workspaceId: workspace.id },
    );

    if (billingSubscription.status !== SubscriptionStatus.Trialing) {
      throw new BillingException(
        'Langganan tidak sedang dalam masa percobaan',
        BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD,
      );
    }

    const planKey = billingSubscription.planKey ?? BillingPlanKey.PRO;
    const interval =
      billingSubscription.interval ?? SubscriptionInterval.Month;

    const pricesPerPlan =
      await this.billingPlanService.getPricesPerPlanByInterval({
        planKey,
        interval,
      });

    const grossAmount = pricesPerPlan.baseProductPrices.reduce(
      (total, price) => total + Math.round(price.unitAmount ?? 0),
      0,
    );

    if (grossAmount <= 0) {
      throw new BillingException(
        'Nominal tagihan tidak valid. Pastikan harga paket sudah dikonfigurasi.',
        BillingExceptionCode.BILLING_PRICE_NOT_FOUND,
      );
    }

    const snapResult = await this.midtransSnapService.createSnapTransaction({
      workspaceId: workspace.id,
      grossAmount,
      transactionType: 'MONTHLY_BILLING',
      customerEmail,
      itemName: `Tagihan pertama Bades - Paket ${planKey}`,
    });

    return {
      checkoutUrl: snapResult.snapRedirectUrl,
      orderId: snapResult.orderId,
    };
  }

  getTrialPeriodFreeWorkflowCredits(
    billingSubscription: BillingSubscriptionEntity,
  ) {
    const trialDuration =
      isDefined(billingSubscription.trialEnd) &&
      isDefined(billingSubscription.trialStart)
        ? differenceInDays(
            billingSubscription.trialEnd,
            billingSubscription.trialStart,
          )
        : 0;

    const trialWithCreditCardDuration = this.badesConfigService.get(
      'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS',
    );

    return Number(
      this.badesConfigService.get(
        trialDuration === trialWithCreditCardDuration
          ? 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD'
          : 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD',
      ),
    );
  }
}

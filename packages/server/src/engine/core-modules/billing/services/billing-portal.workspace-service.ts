/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined, isNonEmptyArray } from 'shared/utils';
import { Not, Repository } from 'typeorm';

import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { SubscriptionStatus } from 'src/engine/core-modules/billing/enums/billing-subscription-status.enum';
import { MidtransSnapService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-snap.service';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { WorkspaceDomainsService } from 'src/engine/core-modules/domain/workspace-domains/services/workspace-domains.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

@Injectable()
export class BillingPortalWorkspaceService {
  protected readonly logger = new Logger(BillingPortalWorkspaceService.name);

  constructor(
    private readonly midtransSnapService: MidtransSnapService,
    private readonly workspaceDomainsService: WorkspaceDomainsService,
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly badesConfigService: BadesConfigService,
    @InjectRepository(BillingSubscriptionEntity)
    private readonly billingSubscriptionRepository: Repository<BillingSubscriptionEntity>,
    @InjectRepository(BillingCustomerEntity)
    private readonly billingCustomerRepository: Repository<BillingCustomerEntity>,
  ) {}

  /**
   * Mengembalikan URL halaman billing internal Bades.
   * Midtrans tidak menyediakan portal pelanggan seperti Stripe.
   */
  async computeBillingPortalSessionURLOrThrow(
    workspace: WorkspaceEntity,
    returnUrlPath?: string,
  ): Promise<string> {
    const frontBaseUrl = this.workspaceDomainsService.buildWorkspaceURL({
      workspace,
    });

    if (returnUrlPath) {
      frontBaseUrl.pathname = returnUrlPath;
    }

    return frontBaseUrl.toString();
  }

  /**
   * Membuat subscription langsung dengan status trialing (tanpa payment method).
   * Untuk trial 7 hari tanpa metode pembayaran.
   */
  async createDirectSubscription({
    user,
    workspace,
    plan,
    interval,
    successUrlPath,
  }: {
    user: AuthContextUser;
    workspace: WorkspaceEntity;
    plan: BillingPlanKey;
    interval: SubscriptionInterval;
    successUrlPath?: string;
  }): Promise<string> {
    const customer = await this.billingCustomerRepository.findOne({
      where: { workspaceId: workspace.id },
      relations: ['billingSubscriptions'],
    });

    if (
      isDefined(customer) &&
      isNonEmptyArray(customer.billingSubscriptions) &&
      customer.billingSubscriptions.some(
        (sub) => sub.status !== SubscriptionStatus.Canceled,
      )
    ) {
      throw new BillingException(
        'Workspace sudah memiliki subscription aktif',
        BillingExceptionCode.BILLING_SUBSCRIPTION_INVALID,
      );
    }

    const trialDays = this.badesConfigService.get(
      'BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS',
    );

    const trialStart = new Date();
    const trialEnd = new Date(trialStart);

    trialEnd.setDate(trialEnd.getDate() + trialDays);

    await this.billingSubscriptionService.createOrRenewSubscription(
      workspace.id,
      plan,
      interval,
      SubscriptionStatus.Trialing,
    );

    const frontBaseUrl = this.workspaceDomainsService.buildWorkspaceURL({
      workspace,
    });

    if (successUrlPath) {
      frontBaseUrl.pathname = successUrlPath;
    }

    return frontBaseUrl.toString();
  }

  /**
   * Membuat sesi checkout Midtrans Snap untuk langganan baru.
   */
  async computeCheckoutSessionURL({
    user,
    workspace,
    plan,
    interval,
    successUrlPath,
  }: {
    user: AuthContextUser;
    workspace: WorkspaceEntity;
    plan: BillingPlanKey;
    interval: SubscriptionInterval;
    successUrlPath?: string;
  }): Promise<string> {
    const frontendUrl = this.badesConfigService.get('FRONTEND_URL') ?? '';
    const callbackUrl = successUrlPath
      ? `${frontendUrl}${successUrlPath}`
      : `${frontendUrl}/settings/billing`;

    const snapResult = await this.midtransSnapService.createSnapTransaction({
      workspaceId: workspace.id,
      grossAmount: 0,
      transactionType: 'MONTHLY_BILLING',
      customerEmail: user.email,
      itemName: `Langganan Bades - Paket ${plan}`,
      callbackFinishUrl: callbackUrl,
    });

    return snapResult.snapRedirectUrl;
  }
}

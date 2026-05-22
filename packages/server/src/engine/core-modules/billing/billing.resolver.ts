/* @license Enterprise */

import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { PermissionFlagType } from 'shared/constants';
import { WorkspaceActivationStatus } from 'shared/workspace';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { type ApiKeyEntity } from 'src/engine/core-modules/api-key/api-key.entity';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import {
  BillingException,
  BillingExceptionCode,
} from 'src/engine/core-modules/billing/billing.exception';
import { BillingEndTrialPeriodDTO } from 'src/engine/core-modules/billing/dtos/billing-end-trial-period.dto';
import { BillingMidtransTransactionStatusDTO } from 'src/engine/core-modules/billing/dtos/billing-midtrans-transaction-status.dto';
import { BillingResourceCreditUsageDTO } from 'src/engine/core-modules/billing/dtos/billing-resource-credit-usage.dto';
import { BillingPlanDTO } from 'src/engine/core-modules/billing/dtos/billing-plan.dto';
import { BillingSessionDTO } from 'src/engine/core-modules/billing/dtos/billing-session.dto';
import { BillingUpdateDTO } from 'src/engine/core-modules/billing/dtos/billing-update.dto';
import { BillingCheckoutSessionInput } from 'src/engine/core-modules/billing/dtos/inputs/billing-checkout-session.input';
import { BillingSessionInput } from 'src/engine/core-modules/billing/dtos/inputs/billing-session.input';
import { BillingTopUpCreditSessionInput } from 'src/engine/core-modules/billing/dtos/inputs/billing-topup-credit-session.input';
import { BillingUpdateSubscriptionItemPriceInput } from 'src/engine/core-modules/billing/dtos/inputs/billing-update-subscription-item-price.input';
import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { type SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { MidtransSnapService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-snap.service';
import { MidtransTransactionService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-transaction.service';
import { BillingPlanService } from 'src/engine/core-modules/billing/services/billing-plan.service';
import { BillingPortalWorkspaceService } from 'src/engine/core-modules/billing/services/billing-portal.workspace-service';
import { BillingSubscriptionUpdateService } from 'src/engine/core-modules/billing/services/billing-subscription-update.service';
import { BillingSubscriptionService } from 'src/engine/core-modules/billing/services/billing-subscription.service';
import { BillingUsageService } from 'src/engine/core-modules/billing/services/billing-usage.service';
import { BillingService } from 'src/engine/core-modules/billing/services/billing.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { formatBillingDatabaseProductToGraphqlDTO } from 'src/engine/core-modules/billing/utils/format-database-product-to-graphql-dto.util';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import {
  INTERNAL_CREDITS_PER_DISPLAY_CREDIT,
  toDisplayCredits,
} from 'src/engine/core-modules/usage/utils/to-display-credits.util';
import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthApiKey } from 'src/engine/decorators/auth/auth-api-key.decorator';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import {
  PermissionsException,
  PermissionsExceptionCode,
  PermissionsExceptionMessage,
} from 'src/engine/metadata-modules/permissions/permissions.exception';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';
@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(
  PermissionsGraphqlApiExceptionFilter,
  PreventNestToAutoLogGraphqlErrorsFilter,
)
export class BillingResolver {
  constructor(
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly billingSubscriptionUpdateService: BillingSubscriptionUpdateService,
    private readonly billingPortalWorkspaceService: BillingPortalWorkspaceService,
    private readonly billingPlanService: BillingPlanService,
    private readonly billingService: BillingService,
    private readonly billingUsageService: BillingUsageService,
    private readonly permissionsService: PermissionsService,
    private readonly midtransSnapService: MidtransSnapService,
    private readonly midtransTransactionService: MidtransTransactionService,
    private readonly twentyConfigService: BadesConfigService,
  ) {}

  @Query(() => BillingSessionDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async billingPortalSession(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args() { returnUrlPath }: BillingSessionInput,
  ) {
    // Midtrans tidak menyediakan portal pelanggan seperti Stripe.
    // Kembalikan URL halaman billing internal Bades sebagai pengganti.
    if (this.twentyConfigService.get('IS_BILLING_MIDTRANS_ENABLED')) {
      const frontendUrl = this.twentyConfigService.get('FRONTEND_URL') ?? '';
      const portalUrl = returnUrlPath
        ? `${frontendUrl}${returnUrlPath}`
        : `${frontendUrl}/settings/billing`;

      return { url: portalUrl };
    }

    return {
      url: await this.billingPortalWorkspaceService.computeBillingPortalSessionURLOrThrow(
        workspace,
        returnUrlPath,
      ),
    };
  }

  @Mutation(() => BillingSessionDTO)
  @UseGuards(WorkspaceAuthGuard, UserAuthGuard, NoPermissionGuard)
  async createTopUpCreditSession(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser() user: AuthContextUser,
    @Args()
    {
      grossAmount,
      itemName,
      callbackFinishUrl,
    }: BillingTopUpCreditSessionInput,
  ) {
    if (!this.twentyConfigService.get('IS_BILLING_MIDTRANS_ENABLED')) {
      throw new BillingException(
        'Top up kredit hanya tersedia saat IS_BILLING_MIDTRANS_ENABLED aktif.',
        BillingExceptionCode.BILLING_PAYMENT_REQUIRED,
      );
    }

    const snapResult = await this.midtransSnapService.createSnapTransaction({
      workspaceId: workspace.id,
      grossAmount,
      transactionType: 'TOP_UP_CREDIT',
      customerEmail: user.email,
      itemName,
      callbackFinishUrl,
    });

    return { url: snapResult.snapRedirectUrl, orderId: snapResult.orderId };
  }

  @Mutation(() => BillingSessionDTO)
  @UseGuards(WorkspaceAuthGuard, UserAuthGuard, NoPermissionGuard)
  async checkoutSession(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser() user: AuthContextUser,
    @AuthUserWorkspaceId() userWorkspaceId: string,
    @Args()
    {
      recurringInterval,
      successUrlPath,
      plan,
      requirePaymentMethod,
    }: BillingCheckoutSessionInput,
    @AuthApiKey() apiKey?: ApiKeyEntity,
  ) {
    await this.validateCanCheckoutSessionPermissionOrThrow({
      workspaceId: workspace.id,
      userWorkspaceId,
      apiKeyId: apiKey?.id,
      workspaceActivationStatus: workspace.activationStatus,
    });

    const checkoutSessionParams = {
      user,
      workspace,
      successUrlPath,
      plan: plan ?? BillingPlanKey.PRO,
      requirePaymentMethod,
    };

    // Jika Midtrans aktif, gunakan Snap untuk checkout langganan
    if (this.twentyConfigService.get('IS_BILLING_MIDTRANS_ENABLED')) {
      const grossAmount = await this.computeMidtransSubscriptionAmount(
        checkoutSessionParams.plan,
        recurringInterval,
      );

      const snapResult = await this.midtransSnapService.createSnapTransaction({
        workspaceId: workspace.id,
        grossAmount,
        transactionType: 'MONTHLY_BILLING',
        customerEmail: user.email,
        itemName: `Langganan Bades - Paket ${checkoutSessionParams.plan}`,
        callbackFinishUrl: successUrlPath
          ? `${this.twentyConfigService.get('FRONTEND_URL')}${successUrlPath}`
          : undefined,
      });

      return { url: snapResult.snapRedirectUrl, orderId: snapResult.orderId };
    }

    const billingPricesPerPlan =
      await this.billingPlanService.getPricesPerPlanByInterval({
        planKey: checkoutSessionParams.plan,
        interval: recurringInterval,
      });

    // Untuk trial 7 hari (tanpa metode pembayaran): buat subscription langsung
    // Untuk trial 30 hari (dengan metode pembayaran): gunakan checkout session
    if (!requirePaymentMethod) {
      const successUrl =
        await this.billingPortalWorkspaceService.createDirectSubscription({
          ...checkoutSessionParams,
          billingPricesPerPlan,
        });

      return {
        url: successUrl,
      };
    } else {
      const checkoutSessionURL =
        await this.billingPortalWorkspaceService.computeCheckoutSessionURL({
          ...checkoutSessionParams,
          billingPricesPerPlan,
        });

      return {
        url: checkoutSessionURL,
      };
    }
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async switchSubscriptionInterval(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ) {
    await this.billingSubscriptionUpdateService.changeInterval(workspace.id);

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async switchBillingPlan(@AuthWorkspace() workspace: WorkspaceEntity) {
    await this.billingSubscriptionUpdateService.changePlan(workspace.id);

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async cancelSwitchBillingPlan(@AuthWorkspace() workspace: WorkspaceEntity) {
    await this.billingSubscriptionUpdateService.cancelSwitchPlan(workspace.id);

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async cancelSwitchBillingInterval(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ) {
    await this.billingSubscriptionUpdateService.cancelSwitchInterval(
      workspace.id,
    );

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async setResourceCreditSubscriptionPrice(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args() { priceId }: BillingUpdateSubscriptionItemPriceInput,
  ) {
    await this.billingSubscriptionUpdateService.changeResourceCreditPrice(
      workspace.id,
      priceId,
    );

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Query(() => [BillingPlanDTO])
  @UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
  async listPlans(): Promise<BillingPlanDTO[]> {
    const plans = await this.billingPlanService.listPlans();

    return plans.map(formatBillingDatabaseProductToGraphqlDTO);
  }

  @Mutation(() => BillingEndTrialPeriodDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async endSubscriptionTrialPeriod(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<BillingEndTrialPeriodDTO> {
    const result =
      await this.billingSubscriptionService.endTrialPeriod(workspace);

    if (!result.hasPaymentMethod && result.stripeCustomerId) {
      const billingPortalUrl =
        await this.billingPortalWorkspaceService.computeBillingPortalSessionURLForPaymentMethodUpdate(
          workspace,
          result.stripeCustomerId,
          '/settings/billing',
        );

      return {
        hasPaymentMethod: false,
        status: undefined,
        billingPortalUrl,
      };
    }

    return {
      hasPaymentMethod: result.hasPaymentMethod,
      status: result.status,
    };
  }

  @Query(() => [BillingResourceCreditUsageDTO])
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async getResourceCreditUsage(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<BillingResourceCreditUsageDTO[]> {
    const usageData =
      await this.billingUsageService.getResourceCreditProductUsage(workspace);

    return usageData.map((item) => ({
      ...item,
      usedCredits: toDisplayCredits(item.usedCredits),
      grantedCredits: toDisplayCredits(item.grantedCredits),
      rolloverCredits: toDisplayCredits(item.rolloverCredits),
      totalGrantedCredits: toDisplayCredits(item.totalGrantedCredits),
      unitPriceCents: item.unitPriceCents * INTERNAL_CREDITS_PER_DISPLAY_CREDIT,
    }));
  }

  @Mutation(() => BillingUpdateDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async cancelSwitchResourceCreditPrice(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ) {
    await this.billingSubscriptionUpdateService.cancelSwitchResourceCreditPrice(
      workspace,
    );

    return {
      billingSubscriptions:
        await this.billingSubscriptionService.getBillingSubscriptions(
          workspace.id,
        ),
      currentBillingSubscription:
        await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow(
          { workspaceId: workspace.id },
        ),
    };
  }

  @Query(() => BillingMidtransTransactionStatusDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    SettingsPermissionGuard(PermissionFlagType.BILLING),
  )
  async getMidtransTransactionStatus(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('orderId', { type: () => String }) orderId: string,
  ): Promise<BillingMidtransTransactionStatusDTO> {
    const transaction =
      await this.midtransTransactionService.findByOrderId(orderId);

    if (!transaction || transaction.workspaceId !== workspace.id) {
      throw new BillingException(
        `Transaksi pembayaran tidak ditemukan untuk orderId=${orderId}.`,
        BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND,
      );
    }

    return {
      orderId: transaction.orderId,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      grossAmount: transaction.grossAmount,
      paymentType: transaction.paymentType ?? undefined,
    };
  }

  /**
   * Menghitung nominal langganan dalam IDR untuk checkout Midtrans Snap.
   * Memakai harga produk dasar paket pada interval terpilih.
   */
  private async computeMidtransSubscriptionAmount(
    plan: BillingPlanKey,
    interval: SubscriptionInterval,
  ): Promise<number> {
    const { baseProductPrices } =
      await this.billingPlanService.getPricesPerPlanByInterval({
        planKey: plan,
        interval,
      });

    const grossAmount = baseProductPrices.reduce(
      (total, price) => total + Math.round(price.unitAmount ?? 0),
      0,
    );

    if (grossAmount <= 0) {
      throw new BillingException(
        'Nominal langganan tidak valid. Pastikan harga paket sudah dikonfigurasi dalam IDR.',
        BillingExceptionCode.BILLING_PRICE_NOT_FOUND,
      );
    }

    return grossAmount;
  }

  private async validateCanCheckoutSessionPermissionOrThrow({
    workspaceId,
    userWorkspaceId,
    apiKeyId,
    workspaceActivationStatus,
  }: {
    workspaceId: string;
    userWorkspaceId: string;
    apiKeyId?: string;
    workspaceActivationStatus: WorkspaceActivationStatus;
  }) {
    if (
      (await this.billingService.isSubscriptionIncompleteOnboardingStatus(
        workspaceId,
      )) ||
      workspaceActivationStatus ===
        WorkspaceActivationStatus.PENDING_CREATION ||
      workspaceActivationStatus === WorkspaceActivationStatus.ONGOING_CREATION
    ) {
      return;
    }

    const userHasPermission =
      await this.permissionsService.userHasWorkspaceSettingPermission({
        userWorkspaceId,
        workspaceId,
        setting: PermissionFlagType.BILLING,
        apiKeyId,
      });

    if (!userHasPermission) {
      throw new PermissionsException(
        PermissionsExceptionMessage.PERMISSION_DENIED,
        PermissionsExceptionCode.PERMISSION_DENIED,
      );
    }
  }
}

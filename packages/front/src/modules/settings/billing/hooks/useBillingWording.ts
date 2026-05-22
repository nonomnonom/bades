import { useFormatPrices } from '@/settings/billing/hooks/useFormatPrices';
import {
  BillingPlanKey,
  SubscriptionInterval,
  SubscriptionStatus,
} from '~/generated-metadata/graphql';
import { assertIsDefinedOrThrow, capitalize } from 'shared/utils';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { useLingui } from '~/utils/i18n/badesI18n';
import { beautifyExactDate } from '~/utils/date-utils';
import { useCurrentPlan } from '@/settings/billing/hooks/useCurrentPlan';
import { useCurrentBillingFlags } from '@/settings/billing/hooks/useCurrentBillingFlags';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useBillingWording = () => {
  const { t } = useLingui();

  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  assertIsDefinedOrThrow(currentWorkspace);

  const currentBillingSubscription =
    currentWorkspace.currentBillingSubscription;

  assertIsDefinedOrThrow(currentBillingSubscription);

  const { formatPrices } = useFormatPrices();

  const { currentPlan } = useCurrentPlan();

  const subscriptionStatus = useSubscriptionStatus();

  const { isYearlyPlan } = useCurrentBillingFlags();

  const getIntervalLabel = (
    isMonthly: boolean,
    asAdjective: boolean = false,
  ): string =>
    isMonthly && asAdjective
      ? t`bulanan`
      : asAdjective
        ? t`tahunan`
        : isMonthly
          ? t`bulan`
          : t`tahun`;

  const getBeautifiedRenewDate = () => {
    assertIsDefinedOrThrow(
      currentBillingSubscription.currentPeriodEnd,
      new Error(`No renew date defined for current subscription.`),
    );

    return beautifyExactDate(
      new Date(currentBillingSubscription.currentPeriodEnd),
    );
  };

  const getIntervalLabelAsAdjectiveCapitalize = (isMonthlyPlan: boolean) => {
    return capitalize(getIntervalLabel(isMonthlyPlan, true));
  };

  const yearlyPrice =
    formatPrices[currentBillingSubscription.planKey as BillingPlanKey]?.[
      SubscriptionInterval.Year
    ];

  const monthlyPrice =
    formatPrices[currentBillingSubscription.planKey as BillingPlanKey]?.[
      SubscriptionInterval.Month
    ];

  const getCurrentIntervalLabel = () =>
    getIntervalLabelAsAdjectiveCapitalize(
      currentBillingSubscription.interval === SubscriptionInterval.Month,
    );

  const enterprisePrice =
    formatPrices[BillingPlanKey.ENTERPRISE]?.[
      currentBillingSubscription.interval as
        | SubscriptionInterval.Month
        | SubscriptionInterval.Year
    ];

  const proPrice =
    formatPrices[BillingPlanKey.PRO]?.[
      currentBillingSubscription.interval as
        | SubscriptionInterval.Month
        | SubscriptionInterval.Year
    ];

  const confirmationModalSwitchToYearlyMessage = () => {
    if (subscriptionStatus === SubscriptionStatus.Trialing) {
      return t`Masa uji coba Anda akan berakhir, dan Anda akan ditagih Rp${yearlyPrice} per pengguna per tahun yang ditagih tahunan. Prorata dengan langganan Anda saat ini akan diterapkan.`;
    }
    return t`Anda akan ditagih Rp${yearlyPrice} per pengguna per tahun yang ditagih tahunan. Prorata dengan langganan Anda saat ini akan diterapkan.`;
  };

  const confirmationModalSwitchToMonthlyMessage = () => {
    const beautifiedRenewDate = getBeautifiedRenewDate();
    return t`Anda akan ditagih Rp${monthlyPrice} per pengguna per bulan yang ditagih bulanan. Perubahan berlaku pada ${beautifiedRenewDate}.`;
  };

  const confirmationModalSwitchToOrganizationMessage = () => {
    const prefix =
      subscriptionStatus === SubscriptionStatus.Trialing
        ? t`Masa uji coba Anda akan berakhir, dan `
        : '';
    const body = t`Anda akan ditagih Rp${enterprisePrice} per pengguna per bulan`;
    const suffix = isYearlyPlan ? t` yang ditagih tahunan` : '';
    return capitalize(`${prefix}${body}${suffix}.`);
  };

  const confirmationModalSwitchToProMessage = () => {
    const beautifiedRenewDate = getBeautifiedRenewDate();
    const suffix1 = isYearlyPlan ? t` yang ditagih tahunan` : '';
    const suffix2 = t`. Perubahan berlaku pada ${beautifiedRenewDate}.`;
    const body = t`Anda akan ditagih Rp${proPrice} per pengguna per bulan`;
    return `${body}${suffix1}${suffix2}`;
  };

  const confirmationModalCancelPlanSwitchingMessage = () => {
    const planKeyWord =
      currentPlan.planKey === BillingPlanKey.ENTERPRISE
        ? t`Organisasi`
        : t`Pro`;

    return t`Tindakan ini membatalkan perubahan paket terjadwal dan mempertahankan paket Anda saat ini (${planKeyWord}).`;
  };

  const confirmationModalCancelIntervalSwitchingMessage = () => {
    const currentIntervalLabel = getCurrentIntervalLabel();

    return t`Tindakan ini membatalkan perubahan interval terjadwal dan mempertahankan interval penagihan Anda saat ini (${currentIntervalLabel}).`;
  };

  return {
    getBeautifiedRenewDate,
    getIntervalLabel,
    getIntervalLabelAsAdjectiveCapitalize,
    confirmationModalSwitchToYearlyMessage,
    confirmationModalSwitchToMonthlyMessage,
    confirmationModalSwitchToOrganizationMessage,
    confirmationModalSwitchToProMessage,
    confirmationModalCancelPlanSwitchingMessage,
    confirmationModalCancelIntervalSwitchingMessage,
  };
};

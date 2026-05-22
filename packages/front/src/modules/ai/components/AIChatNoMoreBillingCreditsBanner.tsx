import { AiChatBanner } from '@/ai/components/AiChatBanner';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { useEndSubscriptionTrialPeriod } from '@/settings/billing/hooks/useEndSubscriptionTrialPeriod';
import { useGetNextResourceCreditPrice } from '@/settings/billing/hooks/useGetNextResourceCreditPrice';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { useMutation } from '@apollo/client/react';
import { t } from '@lingui/core/macro';
import { isDefined } from 'shared/utils';
import {
  PermissionFlagType,
  SetResourceCreditSubscriptionPriceDocument,
  SubscriptionInterval,
  SubscriptionStatus,
} from '~/generated-metadata/graphql';

const AI_CHAT_END_TRIAL_PERIOD_MODAL_ID = 'ai-chat-end-trial-period-modal';
const AI_CHAT_UPGRADE_CREDIT_PLAN_MODAL_ID =
  'ai-chat-upgrade-credit-plan-modal';

export const AIChatNoMoreBillingCreditsBanner = () => {
  const subscriptionStatus = useSubscriptionStatus();

  const { openModal } = useModal();
  const { endTrialPeriod, isLoading: isEndTrialLoading } =
    useEndSubscriptionTrialPeriod();

  const nextPrice = useGetNextResourceCreditPrice();

  const { formatNumber } = useNumberFormat();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const [setResourceCreditSubscriptionPrice, { loading: isUpgrading }] =
    useMutation(SetResourceCreditSubscriptionPriceDocument);

  const { [PermissionFlagType.WORKSPACE]: hasPermissionToManageBilling } =
    usePermissionFlagMap();

  if (!hasPermissionToManageBilling) {
    return null;
  }

  const isTrialing = subscriptionStatus === SubscriptionStatus.Trialing;

  const nextResourceCreditsAmount = isDefined(nextPrice)
    ? formatNumber(nextPrice.creditAmount ?? 0, {
        abbreviate: true,
        decimals: 2,
      })
    : null;

  const nextResourceCreditPrice = isDefined(nextPrice)
    ? formatNumber((nextPrice.unitAmount ?? 0) / 100)
    : null;

  const nextTierInterval = isDefined(nextPrice)
    ? nextPrice.recurringInterval === SubscriptionInterval.Month
      ? t`bulan`
      : t`tahun`
    : null;

  const message = isTrialing
    ? t`Anda telah mencapai batas penggunaan. Berlangganan untuk penggunaan lebih banyak.`
    : isDefined(nextPrice)
      ? t`Anda telah mencapai batas penggunaan. \nTingkatkan ke ${nextResourceCreditsAmount} kredit seharga Rp${nextResourceCreditPrice}/${nextTierInterval}.`
      : t`Anda telah mencapai batas penggunaan. \nHubungi tim dukungan kami untuk meningkatkan paket.`;

  const buttonTitle = isTrialing
    ? t`Berlangganan Sekarang`
    : isDefined(nextPrice)
      ? t`Tingkatkan`
      : undefined;

  const handleButtonClick = isTrialing
    ? () => openModal(AI_CHAT_END_TRIAL_PERIOD_MODAL_ID)
    : isDefined(nextPrice)
      ? () => openModal(AI_CHAT_UPGRADE_CREDIT_PLAN_MODAL_ID)
      : undefined;

  const handleUpgradeConfirm = async () => {
    if (!isDefined(nextPrice)) return;
    try {
      const { data } = await setResourceCreditSubscriptionPrice({
        variables: { priceId: nextPrice.stripePriceId },
      });
      if (
        isDefined(
          data?.setResourceCreditSubscriptionPrice.currentBillingSubscription,
        ) &&
        isDefined(currentWorkspace)
      ) {
        setCurrentWorkspace({
          ...currentWorkspace,
          currentBillingSubscription:
            data.setResourceCreditSubscriptionPrice.currentBillingSubscription,
          billingSubscriptions:
            data.setResourceCreditSubscriptionPrice.billingSubscriptions,
        });
      }
      enqueueSuccessSnackBar({ message: t`Paket kredit berhasil ditingkatkan.` });
    } catch {
      enqueueErrorSnackBar({ message: t`Gagal meningkatkan paket kredit.` });
    }
  };

  return (
    <>
      <AiChatBanner
        message={message}
        variant="warning"
        buttonTitle={buttonTitle}
        buttonOnClick={handleButtonClick}
        isButtonLoading={
          (isTrialing && isEndTrialLoading) || (!isTrialing && isUpgrading)
        }
      />
      {isTrialing && (
        <ConfirmationModal
          modalInstanceId={AI_CHAT_END_TRIAL_PERIOD_MODAL_ID}
          title={t`Mulai Berlangganan`}
          subtitle={t`Kami akan mengaktifkan paket berbayar Anda. Apakah Anda ingin melanjutkan?`}
          onConfirmClick={endTrialPeriod}
          confirmButtonText={t`Konfirmasi`}
          confirmButtonAccent="blue"
          loading={isEndTrialLoading}
        />
      )}
      {!isTrialing && (
        <ConfirmationModal
          modalInstanceId={AI_CHAT_UPGRADE_CREDIT_PLAN_MODAL_ID}
          title={t`Tambah kredit`}
          subtitle={t`Tingkatkan ke ${nextResourceCreditsAmount} kredit seharga Rp${nextResourceCreditPrice}/${nextTierInterval}.`}
          onConfirmClick={handleUpgradeConfirm}
          confirmButtonText={t`Tingkatkan`}
          confirmButtonAccent="blue"
          loading={isUpgrading}
        />
      )}
    </>
  );
};

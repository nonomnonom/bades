import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { useMutation } from '@apollo/client/react';
import { EndSubscriptionTrialPeriodDocument } from '~/generated-metadata/graphql';

export const useEndSubscriptionTrialPeriod = () => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [endSubscriptionTrialPeriod] = useMutation(
    EndSubscriptionTrialPeriodDocument,
  );
  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { redirect } = useRedirect();

  const endTrialPeriod = async () => {
    try {
      setIsLoading(true);

      const { data } = await endSubscriptionTrialPeriod();
      const endTrialPeriodOutput = data?.endSubscriptionTrialPeriod;

      const hasPaymentMethod = endTrialPeriodOutput?.hasPaymentMethod;

      if (isDefined(hasPaymentMethod) && hasPaymentMethod === false) {
        const billingPortalUrl = endTrialPeriodOutput?.billingPortalUrl;

        if (isDefined(billingPortalUrl)) {
          redirect(billingPortalUrl);

          return { success: false };
        }

        enqueueErrorSnackBar({
          message: t`Metode pembayaran belum diatur. Silakan lengkapi informasi pembayaran Anda.`,
        });

        return { success: false };
      }

      const updatedSubscriptionStatus = endTrialPeriodOutput?.status;
      if (
        isDefined(updatedSubscriptionStatus) &&
        isDefined(currentWorkspace?.currentBillingSubscription)
      ) {
        setCurrentWorkspace({
          ...currentWorkspace,
          currentBillingSubscription: {
            ...currentWorkspace?.currentBillingSubscription,
            status: updatedSubscriptionStatus,
          },
        });
      }

      enqueueSuccessSnackBar({
        message: t`Langganan berhasil diaktifkan.`,
      });

      return { success: true };
    } catch {
      enqueueErrorSnackBar({
        message: t`Terjadi kesalahan saat mengakhiri masa uji coba. Silakan hubungi tim Bades.`,
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    endTrialPeriod,
    isLoading,
  };
};

import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { useMutation } from '@apollo/client/react';
import { EndSubscriptionTrialPeriodDocument } from '~/generated-metadata/graphql';

export const useEndSubscriptionTrialPeriod = () => {
  const { enqueueErrorSnackBar } = useSnackBar();
  const [endSubscriptionTrialPeriod] = useMutation(
    EndSubscriptionTrialPeriodDocument,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { redirect } = useRedirect();

  const endTrialPeriod = async () => {
    try {
      setIsLoading(true);

      const { data } = await endSubscriptionTrialPeriod();
      const checkoutUrl = data?.endSubscriptionTrialPeriod?.checkoutUrl;

      if (isDefined(checkoutUrl) && checkoutUrl.length > 0) {
        redirect(checkoutUrl);
        return { success: true };
      }

      enqueueErrorSnackBar({
        message: `Tautan pembayaran belum tersedia. Silakan coba lagi atau hubungi tim Bades.`,
      });
      return { success: false };
    } catch {
      enqueueErrorSnackBar({
        message: `Terjadi kesalahan saat mengakhiri masa uji coba. Silakan hubungi tim Bades.`,
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

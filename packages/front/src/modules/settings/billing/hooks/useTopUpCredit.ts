import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { CREATE_TOP_UP_CREDIT_SESSION } from '@/settings/billing/graphql/mutations/createTopUpCreditSession';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useMutation } from '@apollo/client/react';
import { t } from '@lingui/core/macro';
import { useState } from 'react';

type CreateTopUpCreditSessionData = {
  createTopUpCreditSession: {
    url: string | null;
    orderId: string | null;
  };
};

type CreateTopUpCreditSessionVariables = {
  grossAmount: number;
  itemName: string;
  callbackFinishUrl?: string;
};

/**
 * Memulai sesi isi ulang saldo kredit lewat Midtrans.
 * Setelah sesi dibuat, pengguna dialihkan ke halaman pembayaran Midtrans.
 */
export const useTopUpCredit = () => {
  const { redirect } = useRedirect();

  const { enqueueErrorSnackBar } = useSnackBar();

  const [createTopUpCreditSession] = useMutation<
    CreateTopUpCreditSessionData,
    CreateTopUpCreditSessionVariables
  >(CREATE_TOP_UP_CREDIT_SESSION);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTopUpCredit = async ({
    grossAmount,
    itemName,
  }: {
    grossAmount: number;
    itemName: string;
  }) => {
    setIsSubmitting(true);

    try {
      const { data } = await createTopUpCreditSession({
        variables: {
          grossAmount,
          itemName,
          callbackFinishUrl: `${window.location.origin}/settings/billing`,
        },
      });

      const url = data?.createTopUpCreditSession.url;

      if (url === null || url === undefined) {
        enqueueErrorSnackBar({
          message: t`Gagal memulai pembayaran. Silakan coba lagi atau hubungi tim Bades.`,
        });
        return;
      }

      redirect(url);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal memulai pembayaran. Silakan coba lagi atau hubungi tim Bades.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleTopUpCredit };
};

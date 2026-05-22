import { GET_MIDTRANS_TRANSACTION_STATUS } from '@/settings/billing/graphql/queries/getMidtransTransactionStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useQuery } from '@apollo/client/react';
import { t } from '~/utils/i18n/badesI18n';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isDefined } from 'shared/utils';

type MidtransTransactionStatus = {
  getMidtransTransactionStatus: {
    orderId: string;
    transactionType: string;
    transactionStatus: string;
    grossAmount: number;
    paymentType: string | null;
  };
};

const SUCCESS_STATUSES = ['settlement', 'capture'];
const PENDING_STATUSES = ['pending', 'authorize'];

/**
 * Menangani hasil pembayaran setelah pengguna kembali dari halaman Midtrans.
 * Midtrans menambahkan parameter `order_id` pada URL redirect; hook ini
 * memverifikasi status transaksi ke server lalu menampilkan pemberitahuan.
 */
export const useMidtransPaymentResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const orderId = searchParams.get('order_id');
  const hasNotifiedRef = useRef(false);

  const { data } = useQuery<MidtransTransactionStatus>(
    GET_MIDTRANS_TRANSACTION_STATUS,
    {
      variables: { orderId },
      skip: !isDefined(orderId),
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    const transaction = data?.getMidtransTransactionStatus;

    if (!isDefined(transaction) || hasNotifiedRef.current) {
      return;
    }

    hasNotifiedRef.current = true;

    const status = transaction.transactionStatus.toLowerCase();
    const isTopUp = transaction.transactionType === 'TOP_UP_CREDIT';

    if (SUCCESS_STATUSES.includes(status)) {
      enqueueSuccessSnackBar({
        message: isTopUp
          ? t`Pembayaran berhasil. Saldo kredit akan segera ditambahkan.`
          : t`Pembayaran berhasil. Langganan Anda akan segera aktif.`,
      });
    } else if (PENDING_STATUSES.includes(status)) {
      enqueueSuccessSnackBar({
        message: t`Pembayaran sedang diproses. Status akan diperbarui setelah pembayaran selesai.`,
      });
    } else {
      enqueueErrorSnackBar({
        message: t`Pembayaran belum selesai atau dibatalkan. Silakan coba lagi.`,
      });
    }

    // Bersihkan parameter pembayaran dari URL agar tidak muncul berulang.
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('order_id');
    nextParams.delete('status_code');
    nextParams.delete('transaction_status');
    setSearchParams(nextParams, { replace: true });
  }, [
    data,
    searchParams,
    setSearchParams,
    enqueueSuccessSnackBar,
    enqueueErrorSnackBar,
  ]);
};

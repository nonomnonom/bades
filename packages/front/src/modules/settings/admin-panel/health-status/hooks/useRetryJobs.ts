import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { plural, t } from '@lingui/core/macro';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { useMutation } from '@apollo/client/react';
import { RetryJobsDocument } from '~/generated-admin/graphql';
import { getErrorMessageFromApolloError } from '~/utils/get-error-message-from-apollo-error.util';

export const useRetryJobs = (queueName: string, onSuccess?: () => void) => {
  const apolloAdminClient = useApolloAdminClient();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryJobsMutation] = useMutation(RetryJobsDocument, {
    client: apolloAdminClient,
  });

  const retryJobs = async (jobIds: string[]) => {
    setIsRetrying(true);

    try {
      const result = await retryJobsMutation({
        variables: {
          queueName,
          jobIds,
        },
      });

      const response = result.data?.retryJobs;

      if (isDefined(response)) {
        const { retriedCount, results } = response;
        const failedResults = results.filter((r) => !r.success);

        if (retriedCount === -1) {
          enqueueSuccessSnackBar({
            message: t`Semua tugas gagal telah dicoba ulang`,
          });
        } else if (retriedCount > 0) {
          if (failedResults.length > 0) {
            enqueueSuccessSnackBar({
              message: plural(retriedCount, {
                one: `${retriedCount} tugas berhasil dicoba ulang`,
                other: `${retriedCount} tugas berhasil dicoba ulang`,
              }),
            });
            enqueueErrorSnackBar({
              message: plural(failedResults.length, {
                one: `${failedResults.length} tugas tidak dapat dicoba ulang`,
                other: `${failedResults.length} tugas tidak dapat dicoba ulang`,
              }),
            });
          } else {
            enqueueSuccessSnackBar({
              message: plural(retriedCount, {
                one: `${retriedCount} tugas berhasil dicoba ulang`,
                other: `${retriedCount} tugas berhasil dicoba ulang`,
              }),
            });
          }
        } else {
          const errorMessages = failedResults
            .map((r) => r.error)
            .filter(Boolean);
          const errorDetails =
            errorMessages.length > 0 ? `: ${errorMessages[0]}` : '';

          enqueueErrorSnackBar({
            message: t`Tidak ada tugas yang dicoba ulang${errorDetails}`,
          });
        }

        onSuccess?.();
      }
    } catch (error) {
      enqueueErrorSnackBar({
        message: CombinedGraphQLErrors.is(error)
          ? getErrorMessageFromApolloError(error)
          : t`Gagal mencoba ulang tugas. Silakan coba lagi nanti.`,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    retryJobs,
    isRetrying,
  };
};

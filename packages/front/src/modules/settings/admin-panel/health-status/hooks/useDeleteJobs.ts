import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { plural, t } from '~/utils/i18n/badesI18n';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { useMutation } from '@apollo/client/react';
import { DeleteJobsDocument } from '~/generated-admin/graphql';
import { getErrorMessageFromApolloError } from '~/utils/get-error-message-from-apollo-error.util';

export const useDeleteJobs = (queueName: string, onSuccess?: () => void) => {
  const apolloAdminClient = useApolloAdminClient();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteJobsMutation] = useMutation(DeleteJobsDocument, {
    client: apolloAdminClient,
  });

  const deleteJobs = async (jobIds: string[]) => {
    setIsDeleting(true);

    try {
      const result = await deleteJobsMutation({
        variables: {
          queueName,
          jobIds,
        },
      });

      const response = result.data?.deleteJobs;

      if (isDefined(response)) {
        const { deletedCount, results } = response;
        const failedResults = results.filter((r) => !r.success);

        if (deletedCount > 0) {
          if (failedResults.length > 0) {
            enqueueSuccessSnackBar({
              message: plural(deletedCount, {
                one: `${deletedCount} tugas berhasil dihapus`,
                other: `${deletedCount} tugas berhasil dihapus`,
              }),
            });
            enqueueErrorSnackBar({
              message: plural(failedResults.length, {
                one: `${failedResults.length} tugas tidak dapat dihapus`,
                other: `${failedResults.length} tugas tidak dapat dihapus`,
              }),
            });
          } else {
            enqueueSuccessSnackBar({
              message: plural(deletedCount, {
                one: `${deletedCount} tugas berhasil dihapus`,
                other: `${deletedCount} tugas berhasil dihapus`,
              }),
            });
          }

          onSuccess?.();
        } else {
          const errorMessages = failedResults
            .map((r) => r.error)
            .filter(Boolean);
          const errorDetails =
            errorMessages.length > 0 ? `: ${errorMessages[0]}` : '';

          enqueueErrorSnackBar({
            message: t`Tidak ada tugas yang dihapus${errorDetails}`,
          });
        }
      }
    } catch (error) {
      enqueueErrorSnackBar({
        message: CombinedGraphQLErrors.is(error)
          ? getErrorMessageFromApolloError(error)
          : t`Gagal menghapus tugas. Silakan coba lagi nanti.`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteJobs,
    isDeleting,
  };
};

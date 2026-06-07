import { useCallback } from 'react';

import { useOrigin } from '@/domain-manager/hooks/useOrigin';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { ResendEmailVerificationTokenDocument } from '~/generated-metadata/graphql';

export const useHandleResendEmailVerificationToken = () => {
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const [resendEmailVerificationToken, { loading }] = useMutation(
    ResendEmailVerificationTokenDocument,
  );
  const { origin } = useOrigin();

  const handleResendEmailVerificationToken = useCallback(
    (email: string | null) => {
      return async () => {
        if (!email) {
          enqueueErrorSnackBar({
            message: `Email tidak valid`,
          });
          return;
        }

        try {
          const { data } = await resendEmailVerificationToken({
            variables: {
              email,
              origin,
            },
          });

          if (data?.resendEmailVerificationToken?.success === true) {
            enqueueSuccessSnackBar({
              message: `Tautan verifikasi email telah dikirim ulang!`,
            });
          } else {
            enqueueErrorSnackBar({});
          }
        } catch (error) {
          enqueueErrorSnackBar(
            CombinedGraphQLErrors.is(error)
              ? { apolloError: error }
              : { message: error instanceof Error ? error.message : undefined },
          );
        }
      };
    },
    [
      enqueueErrorSnackBar,
      enqueueSuccessSnackBar,
      resendEmailVerificationToken,
      origin,
    ],
  );

  return { handleResendEmailVerificationToken, loading };
};

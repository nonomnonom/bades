import { useCallback } from 'react';

import { currentUserState } from '@/auth/states/currentUserState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '~/utils/i18n/badesI18n';
import { useMutation } from '@apollo/client/react';
import { EmailPasswordResetLinkDocument } from '~/generated-metadata/graphql';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useHandleResetPassword = () => {
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const [emailPasswordResetLink] = useMutation(EmailPasswordResetLinkDocument);
  const workspacePublicData = useAtomStateValue(workspacePublicDataState);
  const currentUser = useAtomStateValue(currentUserState);

  const { t } = useLingui();

  const handleResetPassword = useCallback(
    (email = currentUser?.email) => {
      return async () => {
        if (!email) {
          enqueueErrorSnackBar({
            message: t`Email tidak valid`,
          });
          return;
        }

        try {
          const { data } = await emailPasswordResetLink({
            variables: workspacePublicData?.id
              ? { email, workspaceId: workspacePublicData.id }
              : { email },
          });

          if (data?.emailPasswordResetLink?.success === true) {
            enqueueSuccessSnackBar({
              message: t`Tautan atur ulang kata sandi telah dikirim ke email`,
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
      currentUser?.email,
      workspacePublicData?.id,
      enqueueErrorSnackBar,
      enqueueSuccessSnackBar,
      t,
      emailPasswordResetLink,
    ],
  );

  return { handleResetPassword };
};

import { useRedirectToWorkspaceDomain } from '@/domain-manager/hooks/useRedirectToWorkspaceDomain';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { AppPath } from 'shared/types';
import { useMutation } from '@apollo/client/react';
import { SignUpInNewWorkspaceDocument } from '~/generated-metadata/graphql';
import { getWorkspaceUrl } from '~/utils/getWorkspaceUrl';
import { assertIsDefinedOrThrow, isDefined } from 'shared/utils';
export const useSignUpInNewWorkspace = () => {
  const { redirectToWorkspaceDomain } = useRedirectToWorkspaceDomain();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [signUpInNewWorkspaceMutation] = useMutation(
    SignUpInNewWorkspaceDocument,
  );

  const createWorkspace = async ({ newTab } = { newTab: true }) => {
    try {
      const { data } = await signUpInNewWorkspaceMutation();
      const signUpInNewWorkspaceData = data?.signUpInNewWorkspace;

      assertIsDefinedOrThrow(signUpInNewWorkspaceData?.workspace);

      if (!isDefined(signUpInNewWorkspaceData.loginToken)) {
        throw new Error(
          'Login token tidak tersedia di hasil signUpInNewWorkspace',
        );
      }

      return await redirectToWorkspaceDomain(
        getWorkspaceUrl(signUpInNewWorkspaceData.workspace.workspaceUrls),
        AppPath.Verify,
        {
          loginToken: signUpInNewWorkspaceData.loginToken.token,
        },
        newTab ? '_blank' : '_self',
      );
    } catch (error) {
      enqueueErrorSnackBar(
        CombinedGraphQLErrors.is(error)
          ? { apolloError: error }
          : {
              message:
                error instanceof Error
                  ? error.message
                  : `Pembuatan ruang kerja gagal`,
            },
      );
    }
  };

  return {
    createWorkspace,
  };
};

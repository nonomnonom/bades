import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { t } from '@lingui/core/macro';
import { IconLifebuoy } from 'ui/display';
import { useMutation } from '@apollo/client/react';
import { UpdateWorkspaceDocument } from '~/generated-metadata/graphql';

export const Toggle2FA = () => {
  const { enqueueErrorSnackBar } = useSnackBar();
  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);

  const handleChange = async () => {
    if (!currentWorkspace?.id) {
      throw new Error('Pengguna belum masuk');
    }

    const newEnforceValue = !currentWorkspace.isTwoFactorAuthenticationEnforced;

    try {
      // Optimistic update
      setCurrentWorkspace({
        ...currentWorkspace,
        isTwoFactorAuthenticationEnforced: newEnforceValue,
      });

      await updateWorkspace({
        variables: {
          input: {
            isTwoFactorAuthenticationEnforced: newEnforceValue,
          },
        },
      });
    } catch (err: any) {
      // Rollback optimistic update if error
      setCurrentWorkspace({
        ...currentWorkspace,
        isTwoFactorAuthenticationEnforced: !newEnforceValue,
      });
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
        message: err?.message,
      });
    }
  };

  return (
    <>
      {currentWorkspace && (
        <SettingsOptionCardContentToggle
          Icon={IconLifebuoy}
          title={t`Autentikasi Dua Faktor`}
          description={t`Wajibkan verifikasi dua langkah untuk setiap login pengguna.`}
          checked={currentWorkspace.isTwoFactorAuthenticationEnforced}
          onChange={handleChange}
          advancedMode
        />
      )}
    </>
  );
};

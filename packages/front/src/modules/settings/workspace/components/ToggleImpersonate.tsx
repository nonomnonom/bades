import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { t } from '~/utils/i18n/badesI18n';
import { IconLifebuoy } from 'ui/display';
import { Card } from 'ui/layout';
import { useMutation } from '@apollo/client/react';
import { UpdateWorkspaceDocument } from '~/generated-metadata/graphql';

export const ToggleImpersonate = () => {
  const { enqueueErrorSnackBar } = useSnackBar();

  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);

  const handleChange = async (value: boolean) => {
    try {
      if (!currentWorkspace?.id) {
        throw new Error('User is not logged in');
      }
      await updateWorkspace({
        variables: {
          input: {
            allowImpersonation: value,
          },
        },
      });
      setCurrentWorkspace({
        ...currentWorkspace,
        allowImpersonation: value,
      });
    } catch (err: any) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    }
  };

  return (
    <Card rounded>
      <SettingsOptionCardContentToggle
        Icon={IconLifebuoy}
        title={t`Izinkan Akses Tim Dukungan`}
        description={t`Berikan akses ke ruang kerja Anda agar kami dapat membantu menyelesaikan masalah.`}
        checked={currentWorkspace?.allowImpersonation ?? false}
        onChange={handleChange}
        advancedMode
      />
    </Card>
  );
};

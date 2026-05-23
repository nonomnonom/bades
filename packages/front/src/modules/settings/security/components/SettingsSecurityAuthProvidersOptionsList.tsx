import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { authProvidersState } from '@/client-config/states/authProvidersState';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { SSOIdentitiesProvidersState } from '@/settings/security/states/SSOIdentitiesProvidersState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { ConnectedAccountProvider } from 'shared/types';
import { capitalize } from 'shared/utils';
import { IconGoogle, IconLink, IconMicrosoft, IconPassword } from 'ui/display';
import { Card } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { useMutation } from '@apollo/client/react';
import {
  type AuthProviders,
  UpdateWorkspaceDocument,
} from '~/generated-metadata/graphql';

import { Toggle2FA } from './Toggle2FA';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const StyledSettingsSecurityOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const SettingsSecurityAuthProvidersOptionsList = () => {
  const { t } = useLingui();

  const { enqueueErrorSnackBar } = useSnackBar();
  const SSOIdentitiesProviders = useAtomStateValue(SSOIdentitiesProvidersState);
  const authProviders = useAtomStateValue(authProvidersState);

  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);

  const isValidAuthProvider = (
    key: string,
  ): key is Exclude<keyof typeof currentWorkspace, '__typename'> => {
    if (!currentWorkspace) return false;
    return Reflect.has(currentWorkspace, key);
  };

  const toggleAuthMethod = async (
    authProvider: keyof Omit<AuthProviders, '__typename' | 'magicLink' | 'sso'>,
  ) => {
    if (!currentWorkspace?.id) {
      throw new Error(t`Pengguna belum masuk`);
    }

    const key = `is${capitalize(authProvider)}AuthEnabled`;

    if (!isValidAuthProvider(key)) {
      throw new Error(t`Penyedia autentikasi tidak valid`);
    }

    const allAuthProvidersEnabled = [
      currentWorkspace.isGoogleAuthEnabled,
      currentWorkspace.isMicrosoftAuthEnabled,
      currentWorkspace.isPasswordAuthEnabled,
      (SSOIdentitiesProviders?.length ?? 0) > 0,
    ];

    if (
      currentWorkspace[key] === true &&
      allAuthProvidersEnabled.filter((isAuthEnabled) => isAuthEnabled).length <=
        1
    ) {
      return enqueueErrorSnackBar({
        message: t`Setidaknya satu metode autentikasi harus diaktifkan`,
      });
    }

    setCurrentWorkspace({
      ...currentWorkspace,
      [key]: !currentWorkspace[key],
    });

    updateWorkspace({
      variables: {
        input: {
          [key]: !currentWorkspace[key],
        },
      },
    }).catch((err) => {
      // rollback optimistic update if err
      setCurrentWorkspace({
        ...currentWorkspace,
        [key]: !currentWorkspace[key],
      });
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    });
  };

  const handleChange = async (value: boolean) => {
    try {
      if (!currentWorkspace?.id) {
        throw new Error(t`Pengguna belum masuk`);
      }
      await updateWorkspace({
        variables: {
          input: {
            isPublicInviteLinkEnabled: value,
          },
        },
      });
      setCurrentWorkspace({
        ...currentWorkspace,
        isPublicInviteLinkEnabled: value,
      });
    } catch (err: any) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    }
  };

  return (
    <StyledSettingsSecurityOptionsList>
      {currentWorkspace && (
        <>
          <Card rounded>
            {authProviders.google === true && (
              <SettingsOptionCardContentToggle
                Icon={IconGoogle}
                title={t`Google`}
                description={t`Izinkan masuk melalui fitur single sign-on Google.`}
                checked={currentWorkspace.isGoogleAuthEnabled}
                advancedMode
                divider
                onChange={() =>
                  toggleAuthMethod(ConnectedAccountProvider.GOOGLE)
                }
              />
            )}
            {authProviders.microsoft === true && (
              <SettingsOptionCardContentToggle
                Icon={IconMicrosoft}
                title={t`Microsoft`}
                description={t`Izinkan masuk melalui fitur single sign-on Microsoft.`}
                checked={currentWorkspace.isMicrosoftAuthEnabled}
                advancedMode
                divider
                onChange={() =>
                  toggleAuthMethod(ConnectedAccountProvider.MICROSOFT)
                }
              />
            )}
            {authProviders.password === true && (
              <SettingsOptionCardContentToggle
                Icon={IconPassword}
                title={t`Kata Sandi`}
                description={t`Izinkan pengguna masuk dengan email dan kata sandi.`}
                checked={currentWorkspace.isPasswordAuthEnabled}
                advancedMode
                onChange={() => toggleAuthMethod('password')}
              />
            )}
          </Card>
          <Card rounded>
            <SettingsOptionCardContentToggle
              Icon={IconLink}
              title={t`Undang via Tautan`}
              description={t`Izinkan undangan pengguna baru dengan berbagi tautan undangan.`}
              checked={currentWorkspace.isPublicInviteLinkEnabled}
              advancedMode
              divider
              onChange={() =>
                handleChange(!currentWorkspace.isPublicInviteLinkEnabled)
              }
            />
            <Toggle2FA />
          </Card>
        </>
      )}
    </StyledSettingsSecurityOptionsList>
  );
};

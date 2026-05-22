/* @license Enterprise */

import { t } from '~/utils/i18n/badesI18n';
import { SettingsListCard } from '@/settings/components/SettingsListCard';
import { SettingsSSOIdentityProviderRowRightContainer } from '@/settings/security/components/SSO/SettingsSSOIdentityProviderRowRightContainer';
import { SSOIdentitiesProvidersState } from '@/settings/security/states/SSOIdentitiesProvidersState';
import { guessSSOIdentityProviderIconByUrl } from '@/settings/security/utils/guessSSOIdentityProviderIconByUrl';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const SettingsSSOIdentitiesProvidersListCardWrapper = () => {
  const navigate = useNavigateSettings();

  const SSOIdentitiesProviders = useAtomStateValue(SSOIdentitiesProvidersState);

  return (
    <SettingsListCard
      items={SSOIdentitiesProviders}
      getItemLabel={(SSOIdentityProvider) =>
        `${SSOIdentityProvider.name} - ${SSOIdentityProvider.type}`
      }
      RowIconFn={(SSOIdentityProvider) =>
        guessSSOIdentityProviderIconByUrl(SSOIdentityProvider.issuer)
      }
      RowRightComponent={({ item: SSOIdp }) => (
        <SettingsSSOIdentityProviderRowRightContainer SSOIdp={SSOIdp} />
      )}
      hasFooter
      footerButtonLabel={t`Tambah Penyedia Identitas SSO`}
      onFooterButtonClick={() => navigate(SettingsPath.NewSSOIdentityProvider)}
    />
  );
};

import { Trans } from '~/utils/i18n/badesI18n';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SetOrChangePassword } from '@/settings/profile/components/SetOrChangePassword';
import { DeleteAccount } from '@/settings/profile/components/DeleteAccount';
import { EmailField } from '@/settings/profile/components/EmailField';
import { NameFields } from '@/settings/profile/components/NameFields';
import { WorkspaceMemberPictureUploader } from '@/settings/workspace-member/components/WorkspaceMemberPictureUploader';
import { useCanChangePassword } from '@/settings/profile/hooks/useCanChangePassword';
import { useCurrentUserWorkspaceTwoFactorAuthentication } from '@/settings/two-factor-authentication/hooks/useCurrentUserWorkspaceTwoFactorAuthentication';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconShield, Status } from 'ui/display';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';

export const SettingsProfile = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const { currentUserWorkspaceTwoFactorAuthenticationMethods } =
    useCurrentUserWorkspaceTwoFactorAuthentication();

  const has2FAMethod =
    currentUserWorkspaceTwoFactorAuthenticationMethods['TOTP']?.status ===
    'VERIFIED';

  const { canChangePassword } = useCanChangePassword();

  if (!currentWorkspaceMember?.id) {
    return null;
  }

  return (
    <SubMenuTopBarContainer
      title={`Profil`}
      links={[
        {
          children: <Trans>Pengguna</Trans>,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: <Trans>Profil</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={`Foto`} />
          <WorkspaceMemberPictureUploader
            workspaceMemberId={currentWorkspaceMember.id}
          />
        </Section>
        <Section>
          <H2Title
            title={`Nama`}
            description={`Nama Anda sebagaimana ditampilkan di sistem`}
          />
          <NameFields />
        </Section>
        <Section>
          <H2Title
            title={`Surel`}
            description={`Alamat surel yang terhubung ke akun Anda`}
          />
          <EmailField />
        </Section>
        <Section>
          <H2Title
            title={`Autentikasi Dua Faktor`}
            description={`Meningkatkan keamanan dengan meminta kode verifikasi tambahan saat masuk`}
          />
          <UndecoratedLink
            to={getSettingsPath(
              SettingsPath.TwoFactorAuthenticationStrategyConfig,
              { twoFactorAuthenticationStrategy: 'TOTP' },
            )}
          >
            <SettingsCard
              title={`Aplikasi Autentikator`}
              Icon={<IconShield />}
              Status={
                has2FAMethod ? (
                  <Status text={`Aktif`} color="turquoise" />
                ) : (
                  <Status text={`Nonaktif`} color="gray" />
                )
              }
            />
          </UndecoratedLink>
        </Section>
        {canChangePassword && (
          <Section>
            <SetOrChangePassword />
          </Section>
        )}
        <Section>
          <DeleteAccount />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

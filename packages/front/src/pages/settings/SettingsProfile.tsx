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
import { Trans, useLingui } from '@lingui/react/macro';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconShield, Status } from 'ui/display';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';

export const SettingsProfile = () => {
  const { t } = useLingui();
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
      title={t`Profil`}
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
          <H2Title title={t`Foto`} />
          <WorkspaceMemberPictureUploader
            workspaceMemberId={currentWorkspaceMember.id}
          />
        </Section>
        <Section>
          <H2Title
            title={t`Nama`}
            description={t`Nama Anda sebagaimana ditampilkan di sistem`}
          />
          <NameFields />
        </Section>
        <Section>
          <H2Title
            title={t`Surel`}
            description={t`Alamat surel yang terhubung ke akun Anda`}
          />
          <EmailField />
        </Section>
        <Section>
          <H2Title
            title={t`Autentikasi Dua Faktor`}
            description={t`Meningkatkan keamanan dengan meminta kode verifikasi tambahan saat masuk`}
          />
          <UndecoratedLink
            to={getSettingsPath(
              SettingsPath.TwoFactorAuthenticationStrategyConfig,
              { twoFactorAuthenticationStrategy: 'TOTP' },
            )}
          >
            <SettingsCard
              title={t`Aplikasi Autentikator`}
              Icon={<IconShield />}
              Status={
                has2FAMethod ? (
                  <Status text={t`Aktif`} color="turquoise" />
                ) : (
                  <Status text={t`Nonaktif`} color="gray" />
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

import { SettingsNewAccountSection } from '@/settings/accounts/components/SettingsNewAccountSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const SettingsNewAccount = () => {
  return (
    <SubMenuTopBarContainer
      title={t`Akun Baru`}
      links={[
        {
          children: t`Pengguna`,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: t`Akun`,
          href: getSettingsPath(SettingsPath.Accounts),
        },
        { children: t`Baru` },
      ]}
    >
      <SettingsPageContainer>
        <SettingsNewAccountSection />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

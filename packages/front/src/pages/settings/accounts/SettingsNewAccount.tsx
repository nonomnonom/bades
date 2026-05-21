import { SettingsNewAccountSection } from '@/settings/accounts/components/SettingsNewAccountSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

export const SettingsNewAccount = () => {
  return (
    <SubMenuTopBarContainer
      title={""New Account"}
      links={[
        {
          children: "Pengguna",
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: "Akun-akun",
          href: getSettingsPath(SettingsPath.Accounts),
        },
        { children: "Baru" },
      ]}
    >
      <SettingsPageContainer>
        <SettingsNewAccountSection />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

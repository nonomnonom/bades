import { t } from '~/utils/i18n/badesI18n';
import { SettingsNewAccountSection } from '@/settings/accounts/components/SettingsNewAccountSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
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

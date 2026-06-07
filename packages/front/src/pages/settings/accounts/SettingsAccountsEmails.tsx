import { SettingsAccountsMessageChannelsContainer } from '@/settings/accounts/components/SettingsAccountsMessageChannelsContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Section } from 'ui/layout';

export const SettingsAccountsEmails = () => {
  return (
    <SubMenuTopBarContainer
      title={`Surel`}
      links={[
        {
          children: `Pengguna`,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: `Akun`,
          href: getSettingsPath(SettingsPath.Accounts),
        },
        { children: `Surel` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <SettingsAccountsMessageChannelsContainer />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

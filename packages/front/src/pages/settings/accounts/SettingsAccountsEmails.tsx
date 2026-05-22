import { SettingsAccountsMessageChannelsContainer } from '@/settings/accounts/components/SettingsAccountsMessageChannelsContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Section } from 'ui/layout';

export const SettingsAccountsEmails = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`Surel`}
      links={[
        {
          children: t`Pengguna`,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: t`Akun`,
          href: getSettingsPath(SettingsPath.Accounts),
        },
        { children: t`Surel` },
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

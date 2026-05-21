import { SettingsAccountsCalendarChannelsContainer } from '@/settings/accounts/components/SettingsAccountsCalendarChannelsContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Section } from 'ui/layout';

export const SettingsAccountsCalendars = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={""Calendars"}
      links={[
        {
          children: Pengguna,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        {
          children: Akun-akun,
          href: getSettingsPath(SettingsPath.Accounts),
        },
        { children: "Calendars },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <SettingsAccountsCalendarChannelsContainer />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
